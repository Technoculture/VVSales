// import { createClient } from '@libsql/client/http';
import { Client as LibsqlClient, createClient } from '@libsql/client/web';
import { Router, RouterType } from 'itty-router';

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

import apiRouter from "./router";

export interface Env {
	LIBSQL_DB_URL?: string;
	LIBSQL_DB_AUTH_TOKEN?: string;
	router?: RouterType;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const response = await apiRouter.handle(request, env);
		return new Response(response.body, { ...response, headers: corsHeaders })
	},
};
