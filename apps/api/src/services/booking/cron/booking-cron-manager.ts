import * as cron from "node-cron";
import { CronJobConfig } from "../../../types/booking.types.js";

export class CronManagerService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private jobConfigs: Map<string, CronJobConfig> = new Map();

  registerJob(
    name: string,
    schedule: string,
    task: () => Promise<void>,
    description: string,
    timezone: string = "Asia/Jakarta"
  ): void {
    const config: CronJobConfig = {
      name,
      schedule,
      enabled: false,
      description,
    };

    const cronJob = cron.schedule(
      schedule,
      async () => {
        console.log(`Running ${name} cron job...`);
        try {
          await task();
        } catch (error) {
          console.error(`${name} cron job failed:`, error);
        }
      },
      {
        timezone,
      }
    );

    this.cronJobs.set(name, cronJob);
    this.jobConfigs.set(name, config);

    console.log(`${name} cron job registered - ${schedule}`);
  }

  startJob(name: string): boolean {
    const cronJob = this.cronJobs.get(name);
    const config = this.jobConfigs.get(name);

    if (cronJob && config) {
      cronJob.start();
      config.enabled = true;
      console.log(`${name} cron job started`);
      return true;
    }

    console.error(`Cron job ${name} not found`);
    return false;
  }

  stopJob(name: string): boolean {
    const cronJob = this.cronJobs.get(name);
    const config = this.jobConfigs.get(name);

    if (cronJob && config) {
      cronJob.stop();
      config.enabled = false;
      console.log(`${name} cron job stopped`);
      return true;
    }

    console.error(`Cron job ${name} not found`);
    return false;
  }

  startAllJobs(): void {
    this.cronJobs.forEach((cronJob, name) => {
      this.startJob(name);
    });
    console.log("All cron jobs started");
  }

  stopAllJobs(): void {
    this.cronJobs.forEach((cronJob, name) => {
      this.stopJob(name);
    });
    console.log("All cron jobs stopped");
  }

  getJobsStatus(): Record<string, CronJobConfig> {
    const status: Record<string, CronJobConfig> = {};
    this.jobConfigs.forEach((config, name) => {
      status[name] = { ...config };
    });
    return status;
  }

  destroyJob(name: string): boolean {
    const cronJob = this.cronJobs.get(name);

    if (cronJob) {
      cronJob.stop();
      cronJob.destroy();
      this.cronJobs.delete(name);
      this.jobConfigs.delete(name);
      console.log(`${name} cron job destroyed`);
      return true;
    }

    return false;
  }

  shutdown(): void {
    console.log("Shutting down cron manager...");
    this.cronJobs.forEach((cronJob, name) => {
      cronJob.stop();
      cronJob.destroy();
      console.log(`${name} cron job destroyed`);
    });
    this.cronJobs.clear();
    this.jobConfigs.clear();
    console.log("Cron manager shutdown complete");
  }
}
