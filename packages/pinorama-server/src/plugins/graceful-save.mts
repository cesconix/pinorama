import { persistToFile } from "@orama/plugin-data-persistence/server"
import type { FastifyInstance } from "fastify"

export async function gracefulSaveHook(fastify: FastifyInstance) {
  fastify.addHook("onClose", async (req) => {
    try {
      const savedPath = await persistToFile(
        fastify.pinoramaDb,
        fastify.pinoramaOpts.dbFormat,
        fastify.pinoramaOpts.dbPath
      )
      req.log.info(`database saved to ${savedPath}`)
    } catch (error) {
      req.log.error(`failed to save database: ${error}`)
    }
  })
}
