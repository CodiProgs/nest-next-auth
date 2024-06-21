import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import * as requestIp from 'request-ip'

export const IpAddress = createParamDecorator(
	(_: string, ctx: ExecutionContext) => {
		const gqlCtx = ctx.getArgByIndex(2)
		const req = gqlCtx.req
		if (req.clientIp) return req.clientIp
		return requestIp.getClientIp(req)
	}
)
