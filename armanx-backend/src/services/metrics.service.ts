import { Types } from 'mongoose';
import { LeadModel } from '../models/Lead.model';
import { SequenceModel } from '../models/Sequence.model';

const round = (value: number) => Math.round(value * 10) / 10;
const calcDelta = (today: number, yesterday: number) => round(((today - yesterday) / (yesterday || 1)) * 100);

export const getDashboardMetrics = async (userId: string) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  const [result] = await LeadModel.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $facet: {
        todayLeads: [
          { $match: { scrapedAt: { $gte: todayStart } } },
          { $count: 'count' },
        ],
        yesterdayLeads: [
          { $match: { scrapedAt: { $gte: yesterdayStart, $lt: todayStart } } },
          { $count: 'count' },
        ],
        contactedToday: [
          { $match: { status: { $in: ['CONTACTED', 'REPLIED', 'MEETING_BOOKED', 'REJECTED'] }, updatedAt: { $gte: todayStart } } },
          { $count: 'count' },
        ],
        contactedYesterday: [
          { $match: { status: { $in: ['CONTACTED', 'REPLIED', 'MEETING_BOOKED', 'REJECTED'] }, updatedAt: { $gte: yesterdayStart, $lt: todayStart } } },
          { $count: 'count' },
        ],
        repliedToday: [
          { $match: { status: { $in: ['REPLIED', 'MEETING_BOOKED'] }, updatedAt: { $gte: todayStart } } },
          { $count: 'count' },
        ],
        repliedYesterday: [
          { $match: { status: { $in: ['REPLIED', 'MEETING_BOOKED'] }, updatedAt: { $gte: yesterdayStart, $lt: todayStart } } },
          { $count: 'count' },
        ],
        meetingsToday: [
          { $match: { status: 'MEETING_BOOKED', updatedAt: { $gte: todayStart } } },
          { $count: 'count' },
        ],
        meetingsYesterday: [
          { $match: { status: 'MEETING_BOOKED', updatedAt: { $gte: yesterdayStart, $lt: todayStart } } },
          { $count: 'count' },
        ],
      },
    },
  ]);

  const scrapedToday = result?.todayLeads?.[0]?.count ?? 0;
  const scrapedYesterday = result?.yesterdayLeads?.[0]?.count ?? 0;
  const connectionsSent = result?.contactedToday?.[0]?.count ?? 0;
  const connectionsYesterday = result?.contactedYesterday?.[0]?.count ?? 0;
  const repliedToday = result?.repliedToday?.[0]?.count ?? 0;
  const repliedYesterday = result?.repliedYesterday?.[0]?.count ?? 0;
  const meetingsBooked = result?.meetingsToday?.[0]?.count ?? 0;
  const meetingsYesterday = result?.meetingsYesterday?.[0]?.count ?? 0;

  return {
    scrapedToday,
    connectionsSent,
    replyRate: connectionsSent > 0 ? round((repliedToday / connectionsSent) * 100) : 0,
    meetingsBooked,
    deltas: {
      scraped: calcDelta(scrapedToday, scrapedYesterday),
      connections: calcDelta(connectionsSent, connectionsYesterday),
      replyRate: calcDelta(
        connectionsSent > 0 ? round((repliedToday / connectionsSent) * 100) : 0,
        connectionsYesterday > 0 ? round((repliedYesterday / connectionsYesterday) * 100) : 0,
      ),
      meetings: meetingsBooked - meetingsYesterday,
    },
  };
};

export const getFunnel = async (userId: string) => {
  const totalProspects = await LeadModel.countDocuments({ userId: new Types.ObjectId(userId) });
  const grouped = await LeadModel.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = grouped.reduce<Record<string, number>>((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const stages = [
    { stage: 'Prospects Found', count: totalProspects, color: '#1D9E75' },
    {
      stage: 'Requests Sent',
      count:
        (counts.CONTACTED ?? 0) + (counts.REPLIED ?? 0) + (counts.MEETING_BOOKED ?? 0) + (counts.REJECTED ?? 0),
      color: '#378ADD',
    },
    { stage: 'Accepted', count: (counts.REPLIED ?? 0) + (counts.MEETING_BOOKED ?? 0), color: '#7F77DD' },
    { stage: 'Replied', count: counts.REPLIED ?? 0, color: '#EF9F27' },
    { stage: 'Meetings Booked', count: counts.MEETING_BOOKED ?? 0, color: '#E24B4A' },
  ];

  return stages.map((stage, index) => {
    const previous = index === 0 ? stage.count : stages[index - 1].count;
    return {
      ...stage,
      conversionPct: index === 0 ? 100 : round((stage.count / (previous || 1)) * 100),
    };
  });
};

export const getTopSequences = async (userId: string) => {
  const sequences = await SequenceModel.find({ userId: new Types.ObjectId(userId) })
    .sort({ replyRate: -1 })
    .limit(5)
    .lean();

  return sequences.map((sequence) => ({
    id: sequence._id.toString(),
    name: sequence.name,
    replyRate: sequence.replyRate,
    activeCount: sequence.activeCount,
    target: sequence.targetMarket,
  }));
};
