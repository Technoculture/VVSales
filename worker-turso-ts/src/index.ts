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

console.log(buildLibsqlClient);

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

	router.post('/call-logs', async (request) => {
		try {
			const client = buildLibsqlClient(env);
			const jsonBody = await request.json();
			console.log('Parsed Request Body:', jsonBody);
			const rs = await client.execute({
				sql: 'insert into callLogs (taskId, callTime, callStatus, duration) values (?, ?, ?, ?)',
				args: [jsonBody.taskId, jsonBody.callTime, jsonBody.callStatus, jsonBody.duration],
			});

			console.log('SQL Execution Result:', rs);

			return new Response('Successfully inserted into callLogs', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			});
		} catch (error) {
			console.error('Error inserting into callLogs:', error);
			return new Response('Error inserting into callLogs', {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	});

	router.post('/tasks', async (request) => {
		try {
			const client = buildLibsqlClient(env);
			console.log(client);
			const jsonBody = await request.json();
			console.log('Parsed Request Body:', jsonBody);
			const rs = await client.execute({
				sql: 'insert into tasks (name, contactNumber, city, state, targetCallCount) values (?, ?, ?, ?, ?)',
				args: [jsonBody.name, jsonBody.contactNumber, jsonBody.city, jsonBody.state, jsonBody.targetCallCount],
			});

			console.log('SQL Execution Result:', rs);

			return new Response('Successfully inserted into tasks', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			});
		} catch (error) {
			console.error('Error inserting into tasks:', error);
			return new Response('Error inserting into tasks', {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	});

	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
