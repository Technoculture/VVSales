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

	//fetch data from tasks table
	router.get('/tasks/:id', async (request) => {
		const client = buildLibsqlClient(env);
		const id = request.params.id;
		if (id === undefined) {
			return new Response('Missing id', { status: 400 });
		}
		if (typeof id !== 'string') {
			return new Response('id must be a single string', { status: 400 });
		}
		if (id.length === 0) {
			return new Response('id length must be > 0', { status: 400 });
		}

		const rs = await client.execute({
			sql: 'select * from tasks where id = ?',
			args: [id],
		});
		return Response.json(rs);
	});

	//fetch data from callLogs table
	router.get('/call-logs/:id', async (request) => {
		const client = buildLibsqlClient(env);
		const id = request.params.id;
		if (id === undefined) {
			return new Response('Missing id', { status: 400 });
		}
		if (typeof id !== 'string') {
			return new Response('id must be a single string', { status: 400 });
		}
		if (id.length === 0) {
			return new Response('id length must be > 0', { status: 400 });
		}

		const rs = await client.execute({
			sql: 'select * from callLogs where id = ?',
			args: [id],
		});
		return Response.json(rs);
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

	//update tasks table based on calls made
	router.put('tasks/:id', async (request) => {
		const client = buildLibsqlClient(env);
		const id = request.params.id;
		if (id === undefined) {
			return new Response('Missing id', { status: 400 });
		}
		if (typeof id !== 'string') {
			return new Response('id must be a single string', { status: 400 });
		}
		if (id.length === 0) {
			return new Response('id length must be > 0', { status: 400 });
		}

		const body = await request.json();
		const rs = await client.execute({
			sql: 'update tasks set name = ?, contactNumber = ?, city = ?, state = ?, targetCallCount = ? where id = ?',
			args: [body.name, body.contactNumber, body.city, body.state, body.targetCallCount, id],
		});
	});

	router.all('*', () => new Response('Not Found.', { status: 404 }));

	return router;
}
