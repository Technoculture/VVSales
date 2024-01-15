// import { createClient } from '@libsql/client/http';
import { Client as LibsqlClient, createClient } from '@libsql/client/web';
import { Router, RouterType } from 'itty-router';

export interface Env {
	LIBSQL_DB_URL?: string;
	LIBSQL_DB_AUTH_TOKEN?: string;
	router?: RouterType;
}

interface CallLogsRequestBody {
	contactNumber: string;
	taskId: number;
	duration: number;
}

interface TasksRequestBody {
	name: string;
	contactNumber: string;
	city: string;
	state: string;
	targetCallCount: number;
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
const headers = new Headers();

function buildRouter(env: Env): RouterType {
	const router = Router();

	router.all('*', (request) => {
		const headers = new Headers({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		});

		if (request.method === 'OPTIONS') {
			// Handle preflight requests
			return new Response(null, { headers });
		}

		return null;
	});

	// Fetch tasks
	router.get('/tasks', async () => {
		const client = buildLibsqlClient(env);
		const rs = await client.execute('select * from tasks');
		return new Response(JSON.stringify(rs), {
			headers: { 'content-type': 'application/json' },
		});
	});

	// Fetch call logs
	router.get('/call-logs', async () => {
		const client = buildLibsqlClient(env);
		const rs = await client.execute('select * from callLogs');
		return new Response(JSON.stringify(rs), {
			headers: { 'content-type': 'application/json' },
		});
	});

	router.post('/call-logs', async (request) => {
		try {
			const client = buildLibsqlClient(env);
			const contentType = request.headers.get('content-type');

			if (!contentType || contentType.indexOf('application/json') !== 0) {
				throw new Error('Invalid content type. Expected application/json.');
			}
			// console.log('Request Body:', request?.body);
			const b = await request.json();
			console.log('Request Body B:', b);
			const jsonBody = b as CallLogsRequestBody;
			console.log('Parsed Request Body:', jsonBody);

			if (!jsonBody || typeof jsonBody !== 'object') {
				throw new Error('Invalid JSON format in the request body.');
			}

			console.log('Parsed Request Body:', jsonBody);

			// Check if the contactNumber exists in tasks
			const tasks = await client.execute({
				sql: 'select * from tasks where contactNumber = ?',
				args: [jsonBody.contactNumber],
			});

			if (tasks.rows.length > 0) {
				// Phone number exists in tasks, proceed with insertion
				const taskId = tasks.rows[0].id;

				// Decrease trials by 1 for the corresponding task
				const updateTaskResponse = await client.execute({
					sql: 'update tasks set targetCallCount = targetCallCount - 1 where id = ?',
					args: [taskId],
				});

				console.log('Task trials updated:', updateTaskResponse);

				const rs = await client.execute({
					sql: 'insert into callLogs (taskId, contactNumber, duration) values (?, ?, ?)',
					args: [jsonBody.taskId, jsonBody.contactNumber, jsonBody.duration],
				});

				console.log('SQL Execution Result:', rs);

				return new Response('Successfully inserted into callLogs', {
					status: 200,
					headers: {
						'Content-Type': 'text/plain',
						...headers,
					},
				});
			}
		} catch (error) {
			console.error('Error inserting into callLogs:', error);
			return new Response('Error inserting into callLogs', {
				status: 500,
				headers: {
					'Content-Type': 'text/plain',
					...headers,
				},
			});
		}
	});

	router.post('/tasks', async (request) => {
		try {
			const client = buildLibsqlClient(env);
			const jsonBody = (await request.json()) as TasksRequestBody;
			console.log('Parsed Request Body:', jsonBody);
			const rs = await client.execute({
				sql: 'insert into tasks (name, contactNumber, city, state, targetCallCount) values (?, ?, ?, ?, ?)',
				args: [jsonBody.name, jsonBody.contactNumber, jsonBody.city, jsonBody.state, jsonBody.targetCallCount],
			});

			console.log('SQL Execution Result:', rs);

			return new Response('Successfully inserted into tasks', {
				status: 200,
				headers: {
					'Content-Type': 'text/plain',
					...headers,
				},
			});
		} catch (error) {
			console.error('Error inserting into tasks:', error);
			return new Response('Error inserting into tasks', {
				status: 500,
				headers: {
					'Content-Type': 'text/plain',
					...headers,
				},
			});
		}
	});

	// 404 - Not Found
	router.all(
		'*',
		() =>
			new Response('Not Found.', {
				status: 404,
				headers: {
					...headers,
				},
			}),
	);

	return router;
}
