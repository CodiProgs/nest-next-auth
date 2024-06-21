import { BadRequestException, Injectable } from '@nestjs/common'
import { extname, join } from 'path'
import { PUBLIC_PATH } from 'src/common/config'
import { pipeline } from 'stream/promises'
import {
	createWriteStream,
	existsSync,
	promises as fsPromises,
	unlinkSync
} from 'fs'

@Injectable()
export class FileService {
	async saveFile(
		file: {
			createReadStream: () => any
			filename: string
			mimetype: string
		},
		nameFolder: string,
	): Promise<string> {
		if (!file) {
			throw new BadRequestException({ message: 'File is missing' })
		}

		const date = new Date()
		const year = date.getFullYear().toString()
		const month = String(date.getMonth() + 1).padStart(2, '0')

		const fileName = `${Date.now()}${extname(file.filename)}`
		const filePath = join(
			nameFolder,
			year,
			month,
		)
		try {
			const stream = file.createReadStream()
			await fsPromises.mkdir(join(PUBLIC_PATH, filePath), {
				recursive: true
			})
			await pipeline(stream, createWriteStream(join(PUBLIC_PATH, filePath, fileName)))
		} catch (error) {
			throw new BadRequestException({
				message: `Error saving file: ${error.message}`
			})
		}
		return join(filePath, fileName)
	}

	async deleteFile(filePath: string) {
		if (filePath){
			const filePathToDelete = join(PUBLIC_PATH, filePath)
			if (existsSync(filePathToDelete)) {
				unlinkSync(filePathToDelete)
			}
		}
	}
}
