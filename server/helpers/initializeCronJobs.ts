import { schedule } from 'node-cron'
import knex from '../database/connection'
import * as dayjs from 'dayjs'

async function expireUrls() {
  console.log('expiring urls')
  const expiredUrls = await knex.from('urls')
    .update({ active: false })
    .where('expiresAt', '<', dayjs().toDate())
    .andWhere({ active: true })
  console.log('expiredUrls', expiredUrls)
}

export default function initializeCronJobs() {
  schedule('* * * * *', expireUrls)
}