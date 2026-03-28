"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
const registerUser = async (email) => {
    const response = await (0, supertest_1.default)(server_1.app).post('/api/v1/auth/register').send({
        email,
        password: 'strongpass123',
        fullName: 'Agent User',
    });
    return response.body.token;
};
describe('Agent API', () => {
    it('supports CRUD and status actions with auth isolation', async () => {
        const tokenA = await registerUser('agent-a@example.com');
        const tokenB = await registerUser('agent-b@example.com');
        const createResponse = await (0, supertest_1.default)(server_1.app)
            .post('/api/v1/agents')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
            name: 'Lead Gen Agent',
            type: 'SCRAPER',
        });
        expect(createResponse.status).toBe(201);
        expect(createResponse.body.name).toBe('Lead Gen Agent');
        const agentId = createResponse.body.id;
        const listResponse = await (0, supertest_1.default)(server_1.app).get('/api/v1/agents').set('Authorization', `Bearer ${tokenA}`);
        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toHaveLength(1);
        const updateResponse = await (0, supertest_1.default)(server_1.app)
            .put(`/api/v1/agents/${agentId}`)
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ name: 'Updated Agent' });
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.name).toBe('Updated Agent');
        const startResponse = await (0, supertest_1.default)(server_1.app)
            .post(`/api/v1/agents/${agentId}/start`)
            .set('Authorization', `Bearer ${tokenA}`);
        expect(startResponse.status).toBe(200);
        expect(startResponse.body.status).toBe('running');
        const pauseResponse = await (0, supertest_1.default)(server_1.app)
            .post(`/api/v1/agents/${agentId}/pause`)
            .set('Authorization', `Bearer ${tokenA}`);
        expect(pauseResponse.status).toBe(200);
        expect(pauseResponse.body.status).toBe('paused');
        const foreignGetResponse = await (0, supertest_1.default)(server_1.app)
            .get(`/api/v1/agents/${agentId}`)
            .set('Authorization', `Bearer ${tokenB}`);
        expect(foreignGetResponse.status).toBe(404);
    });
});
