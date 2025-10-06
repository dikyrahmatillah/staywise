import { CronManagerService } from "./booking-cron-manager.js";
import { BookingExpirationJob } from "../../../jobs/booking-expiration.job.js";
import { BookingConfirmationJob } from "../../../jobs/booking-confirmation.job.js";
import { BookingCompletionJob } from "../../../jobs/booking-completion.job.js";
import { BookingOverdueJob } from "../../../jobs/booking-overdue.job.js";

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
    // 🧪 TESTING MODE - All jobs run every 2 minutes
    // TODO: Revert to production schedules after testing

    // Register booking expiration job - TESTING: every 2 minutes (PROD: */5 * * * *)
    this.cronManager.registerJob(
      "booking-expiration",
      "*/2 * * * *",
      async () => {
        const result = await this.expirationJob.execute();
        console.log(
          `✅ [TEST] Expiration job completed: ${result.expiredCount} bookings processed`
        );
      },
      "Expire bookings that haven't been paid within the time limit"
    );

    // Register auto-confirmation job - TESTING: every 2 minutes (PROD: 0 */2 * * *)
    this.cronManager.registerJob(
      "booking-confirmation",
      "*/2 * * * *",
      async () => {
        const result = await this.confirmationJob.execute();
        console.log(
          `✅ [TEST] Confirmation job completed: ${result.confirmedCount} bookings processed`
        );
      },
      "Auto-confirm bookings waiting for confirmation"
    );

    // Register booking completion job - TESTING: every 2 minutes (PROD: 0 2 * * *)
    this.cronManager.registerJob(
      "booking-completion",
      "*/2 * * * *",
      async () => {
        const result = await this.completionJob.execute();
        console.log(
          `✅ [TEST] Completion job completed: ${result.completedCount} bookings processed`
        );
      },
      "Complete bookings after checkout date"
    );

    // Register overdue booking cancellation job - TESTING: every 2 minutes (PROD: 0 1 * * *)
    this.cronManager.registerJob(
      "booking-overdue",
      "*/2 * * * *",
      async () => {
        const result = await this.overdueJob.execute();
        console.log(
          `✅ [TEST] Overdue job completed: ${result.canceledCount} bookings processed`
        );
      },
      "Cancel bookings that are overdue"
    );

    console.log(
      "🧪 CRON JOBS RUNNING IN TEST MODE - All jobs execute every 2 minutes"
    );
  }

  // Public methods to control individual jobs
  startExpirationJob(): boolean {
    return this.cronManager.startJob("booking-expiration");
  }

  startConfirmationJob(): boolean {
    return this.cronManager.startJob("booking-confirmation");
  }

  startCompletionJob(): boolean {
    return this.cronManager.startJob("booking-completion");
  }

  startOverdueJob(): boolean {
    return this.cronManager.startJob("booking-overdue");
  }

  stopExpirationJob(): boolean {
    return this.cronManager.stopJob("booking-expiration");
  }

  stopConfirmationJob(): boolean {
    return this.cronManager.stopJob("booking-confirmation");
  }

  stopCompletionJob(): boolean {
    return this.cronManager.stopJob("booking-completion");
  }

  stopOverdueJob(): boolean {
    return this.cronManager.stopJob("booking-overdue");
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
    console.log("Running all booking maintenance tasks...");

    const results = await Promise.allSettled([
      this.expirationJob.execute(),
      this.confirmationJob.execute(),
      this.completionJob.execute(),
      this.overdueJob.execute(),
    ]);

    results.forEach((result, index) => {
      const taskNames = ["expiration", "confirmation", "completion", "overdue"];
      if (result.status === "rejected") {
        console.error(`${taskNames[index]} task failed:`, result.reason);
      }
    });

    return results;
  }

  shutdown(): void {
    this.cronManager.shutdown();
  }
}
