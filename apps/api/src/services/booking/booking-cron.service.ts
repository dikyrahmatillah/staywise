import { CronManagerService } from './booking-cron-manager.js';
import { BookingExpirationJob } from '@/jobs/booking-expiration.job.js';
import { BookingConfirmationJob } from '@/jobs/booking-confirmation.job.js';
import { BookingCompletionJob } from '@/jobs/booking-completion.job.js';
import { BookingOverdueJob } from '@/jobs/booking-overdue.job.js';

export class BookingCronService {
  private cronManager: CronManagerService;
  private expirationJob: BookingExpirationJob;
  private confirmationJob: BookingConfirmationJob;
  private completionJob: BookingCompletionJob;
  private overdueJob: BookingOverdueJob;

  constructor() {
    this.cronManager = new CronManagerService();
    this.expirationJob = new BookingExpirationJob();
    this.confirmationJob = new BookingConfirmationJob();
    this.completionJob = new BookingCompletionJob();
    this.overdueJob = new BookingOverdueJob();
    
    this.registerAllJobs();
  }

  private registerAllJobs(): void {
    // Register booking expiration job - every 5 minutes
    this.cronManager.registerJob(
      'booking-expiration',
      '*/5 * * * *',
      async () => {
        const result = await this.expirationJob.execute();
        console.log(`Expiration job completed: ${result.expiredCount} bookings processed`);
      },
      'Expire bookings that haven\'t been paid within the time limit'
    );

    // Register auto-confirmation job - every 2 hours
    this.cronManager.registerJob(
      'booking-confirmation',
      '0 */2 * * *',
      async () => {
        const result = await this.confirmationJob.execute();
        console.log(`Confirmation job completed: ${result.confirmedCount} bookings processed`);
      },
      'Auto-confirm bookings waiting for confirmation'
    );

    // Register booking completion job - daily at 2 AM
    this.cronManager.registerJob(
      'booking-completion',
      '0 2 * * *',
      async () => {
        const result = await this.completionJob.execute();
        console.log(`Completion job completed: ${result.completedCount} bookings processed`);
      },
      'Complete bookings after checkout date'
    );

    // Register overdue booking cancellation job - daily at 1 AM
    this.cronManager.registerJob(
      'booking-overdue',
      '0 1 * * *',
      async () => {
        const result = await this.overdueJob.execute();
        console.log(`Overdue job completed: ${result.canceledCount} bookings processed`);
      },
      'Cancel bookings that are overdue'
    );
  }

  // Public methods to control individual jobs
  startExpirationJob(): boolean {
    return this.cronManager.startJob('booking-expiration');
  }

  startConfirmationJob(): boolean {
    return this.cronManager.startJob('booking-confirmation');
  }

  startCompletionJob(): boolean {
    return this.cronManager.startJob('booking-completion');
  }

  startOverdueJob(): boolean {
    return this.cronManager.startJob('booking-overdue');
  }

  stopExpirationJob(): boolean {
    return this.cronManager.stopJob('booking-expiration');
  }

  stopConfirmationJob(): boolean {
    return this.cronManager.stopJob('booking-confirmation');
  }

  stopCompletionJob(): boolean {
    return this.cronManager.stopJob('booking-completion');
  }

  stopOverdueJob(): boolean {
    return this.cronManager.stopJob('booking-overdue');
  }

  // Control all jobs
  startAllJobs(): void {
    this.cronManager.startAllJobs();
  }

  stopAllJobs(): void {
    this.cronManager.stopAllJobs();
  }

  getJobsStatus(): Record<string, any> {
    return this.cronManager.getJobsStatus();
  }

  // Manual execution for testing
  async runExpirationJob() {
    return await this.expirationJob.execute();
  }

  async runConfirmationJob() {
    return await this.confirmationJob.execute();
  }

  async runCompletionJob() {
    return await this.completionJob.execute();
  }

  async runOverdueJob() {
    return await this.overdueJob.execute();
  }

  async runAllMaintenanceTasks() {
    console.log('Running all booking maintenance tasks...');
    
    const results = await Promise.allSettled([
      this.expirationJob.execute(),
      this.confirmationJob.execute(),
      this.completionJob.execute(),
      this.overdueJob.execute()
    ]);

    results.forEach((result, index) => {
      const taskNames = ['expiration', 'confirmation', 'completion', 'overdue'];
      if (result.status === 'rejected') {
        console.error(`${taskNames[index]} task failed:`, result.reason);
      }
    });

    return results;
  }

  shutdown(): void {
    this.cronManager.shutdown();
  }
}