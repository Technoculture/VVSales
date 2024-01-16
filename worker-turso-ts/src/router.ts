import { Client as LibsqlClient, createClient } from '@libsql/client/web';
import { Router, IRequest } from 'itty-router';
const router = Router();

interface CallLogsRequestBody {
	phoneNumber: string;
	taskId: number;
	callDuration: number;
}

interface TasksRequestBody {
	name: string;
	contactNumber: string;
	city: string;
	state: string;
	targetCallCount: number;
}

function buildLibsqlClient(env: any): LibsqlClient {
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

router.get('/tasks', async (request, env) => {
	const client = buildLibsqlClient(env);
	const rs = await client.execute('select * from tasks');
	return new Response(JSON.stringify(rs), {
		headers: { 'content-type': 'application/json' },
	});
});

router.get('/call-logs', async (request, env) => {
	const client = buildLibsqlClient(env);
	const rs = await client.execute('select * from callLogs');
	return new Response(JSON.stringify(rs), {
		headers: { 'content-type': 'application/json' },
	});
});

//expecting this from an array of objects
router.post('/call-logs', async (request: IRequest, env) => {
	try {
		const client = buildLibsqlClient(env);
		const jsonBody = (await request.json()) as CallLogsRequestBody; //expecting this from an array of objects

		console.log('Parsed Request Body:', jsonBody);

		// Check if the contactNumber exists in tasks
		// const tasks = await client.execute({
		// 	sql: 'select * from tasks where contactNumber = ?',
		// 	args: [jsonBody.contactNumber],
		// });

		//call-duration is not read

		// if (tasks.rows.length > 0) {
		// 	Phone number exists in tasks, proceed with insertion
		// 	const taskId = tasks.rows[0].id;

		// 	Decrease trials by 1 for the corresponding task
		// 	const updateTaskResponse = await client.execute({
		// 		sql: 'update tasks set targetCallCount = targetCallCount - 1 where id = ?',
		// 		args: [taskId],
		// 	});

		// 	console.log('Task trials updated:', updateTaskResponse);

			// Continue with callLogs insertion
			// const rs = await client.execute({
			// 	sql: 'insert into callLogs (taskId, contactNumber, duration) values (?, ?, ?)',
			// 	args: [jsonBody.taskId, jsonBody.contactNumber, jsonBody.duration],
			// });

			// console.log('SQL Execution Result:', rs);

		// 	return new Response('Successfully inserted into callLogs', {
		// 		status: 200,
		// 		headers: {
		// 			'Content-Type': 'text/plain',
		// 		},
		// 	});
		// }

		return Response.json(
			{ ok: 'true' },
			{
				headers: {
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Origin': '*',
				},
			},
		);
	} catch (error) {
		console.error('Error inserting into callLogs:', error);
		return new Response('Error inserting into callLogs', {
			status: 500,
		});
	}
});

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
