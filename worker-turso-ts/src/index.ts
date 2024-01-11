// import { createClient } from '@libsql/client/http';
import { Client as LibsqlClient, createClient } from '@libsql/client/web';
import { Router, RouterType } from 'itty-router';

export interface Env {
	LIBSQL_DB_URL?: string;
	LIBSQL_DB_AUTH_TOKEN?: string;
	router?: RouterType;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (env.router === undefined) {
			env.router = buildRouter(env);
		}

		return env.router.handle(request);
	},
};

function buildLibsqlClient(env: Env): LibsqlClient {
	const url = env.LIBSQL_DB_URL?.trim();
	if (url === undefined) {
		throw new Error('LIBSQL_DB_URL env var is not defined');
	}

	const authToken = env.LIBSQL_DB_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		throw new Error('LIBSQL_DB_AUTH_TOKEN env var is not defined');
	}

	return createClient({ url, authToken });
}

function buildRouter(env: Env): RouterType {
	const router = Router();

	router.get('/tasks', async () => {
		const client = buildLibsqlClient(env);
		const rs = await client.execute('select * from tasks');
		// return Response.json(rs);
		return new Response(JSON.stringify(rs), {
			headers: { 'content-type': 'application/json' },
		});
	});

	router.get('/call-logs', async () => {
		const client = buildLibsqlClient(env);
		const rs = await client.execute('select * from callLogs');
		// return Response.json(rs);
		return new Response(JSON.stringify(rs), {
			headers: { 'content-type': 'application/json' },
		});
	});

	//post changes to tasks table
	router.post('call-logs', async (request) => {
		const client = buildLibsqlClient(env);
		const body = await request.json();
		const rs = await client.execute({
			sql: 'insert into callLogs (taskId, callTime, callStatus, duration) values (?, ?, ?, ?)',
			args: [body.taskId, body.callTime, body.callStatus, body.duration],
		});
	});

	//post changes to callLogs table
	router.post('tasks', async (request) => {
		const client = buildLibsqlClient(env);
		const body = await request.json();
		const rs = await client.execute({
			sql: 'insert into tasks (name, contactNumber, city, state, targetCallCount) values (?, ?, ?, ?, ?)',
			args: [body.name, body.contactNumber, body.city, body.state, body.targetCallCount],
		});
	});

	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
