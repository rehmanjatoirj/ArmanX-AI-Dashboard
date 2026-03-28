"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
describe('Metrics API', () => {
    it('returns dashboard metrics and funnel stages', async () => {
        const authResponse = await (0, supertest_1.default)(server_1.app).post('/api/v1/auth/register').send({
            email: 'metrics@example.com',
            password: 'strongpass123',
            fullName: 'Metrics User',
        });
        const token = authResponse.body.token;
        const agentResponse = await (0, supertest_1.default)(server_1.app)
            .post('/api/v1/agents')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Metrics Agent', type: 'SCRAPER' });
        const agentId = agentResponse.body.id;
        await (0, supertest_1.default)(server_1.app)
            .post('/api/v1/leads/bulk')
            .set('Authorization', `Bearer ${token}`)
            .send({
            leads: [
                {
                    agentId,
                    linkedinUrl: 'https://linkedin.com/in/fatima',
                    fullName: 'Fatima Al-Said',
                    jobTitle: 'HR Director',
                    company: 'Dubai Digital Hub',
                    status: 'CONTACTED',
                },
                {
                    agentId,
                    linkedinUrl: 'https://linkedin.com/in/omar',
                    fullName: 'Omar Sheikh',
                    jobTitle: 'Head of Growth',
                    company: 'Karachi Tech Hub',
                    status: 'REPLIED',
                },
                {
                    agentId,
                    linkedinUrl: 'https://linkedin.com/in/nadia',
                    fullName: 'Nadia Al-Rashid',
                    jobTitle: 'Ops Head',
                    company: 'Abu Dhabi Fintech',
                    status: 'MEETING_BOOKED',
                },
            ],
        });
        const dashboardResponse = await (0, supertest_1.default)(server_1.app)
            .get('/api/v1/metrics/dashboard')
            .set('Authorization', `Bearer ${token}`);
        expect(dashboardResponse.status).toBe(200);
        expect(dashboardResponse.body).toHaveProperty('scrapedToday');
        expect(dashboardResponse.body).toHaveProperty('deltas');
        const funnelResponse = await (0, supertest_1.default)(server_1.app)
            .get('/api/v1/metrics/funnel')
            .set('Authorization', `Bearer ${token}`);
        expect(funnelResponse.status).toBe(200);
        expect(funnelResponse.body).toHaveLength(5);
        expect(funnelResponse.body[0]).toHaveProperty('stage');
    });
});
