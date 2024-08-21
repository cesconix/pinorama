import { createPreset } from "../utils.mjs"

export const fastify = createPreset(
  {
    time: "number",
    level: "enum",
    msg: "string",
    pid: "enum",
    hostname: "string",
    reqId: "string",
    req: {
      method: "string",
      url: "string",
      hostname: "string",
      remoteAddress: "string",
      remotePort: "enum"
    },
    res: {
      statusCode: "enum"
    },
    responseTime: "number"
  },
  {
    facets: {
      level: "enum",
      msg: "string",
      "req.method": "string",
      "req.url": "string",
      "res.statusCode": "enum",
      "req.hostname": "string",
      "req.remoteAddress": "string",
      "req.remotePort": "enum",
      pid: "enum",
      hostname: "string"
    },
    columns: {
      time: true, // pino
      level: true, // pino
      msg: true, // pino
      reqId: true,
      "req.method": true,
      "req.url": true,
      "res.statusCode": true,
      "req.hostname": false,
      "req.remoteAddress": false,
      "req.remotePort": false,
      responseTime: false,
      pid: false, // pino
      hostname: false // pino
    },
    labels: {
      level: [
        "Level",
        {
          10: "TRACE",
          20: "DEBUG",
          30: "INFO",
          40: "WARN",
          50: "ERROR",
          60: "FATAL"
        }
      ],
      time: "Time",
      msg: "Message",
      pid: "PID",
      hostname: "Host",
      reqId: "Req. ID",
      "req.method": [
        "Method",
        {
          GET: "GET",
          POST: "POST",
          PUT: "PUT",
          PATCH: "PATCH",
          DELETE: "DELETE",
          HEAD: "HEAD",
          OPTIONS: "OPTIONS"
        }
      ],
      "req.url": "URL",
      "req.hostname": "Req. Host",
      "req.remoteAddress": "Address",
      "req.remotePort": "Port",
      "res.statusCode": "Status",
      responseTime: "Res. Time"
    },
    formatters: {
      time: "timestamp"
    },
    styles: {
      time: {
        opacity: "0.5"
      },
      level: [
        {},
        {
          10: { color: "var(--color-gray-500)" },
          20: { color: "var(--color-purple-500)" },
          30: { color: "var(--color-lime-500)" },
          40: { color: "var(--color-yellow-500)" },
          50: { color: "var(--color-red-500)" },
          60: { color: "var(--color-red-500)" }
        }
      ]
    }
  }
)
