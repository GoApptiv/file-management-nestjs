import cluster from 'node:cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';

const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
  static clusterize(callback: any): void {
    if (cluster.isPrimary) {
      console.info(`Master server started on ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.info(
          `Worker ${worker.process.pid} died. Restarting`,
          code,
          signal,
        );
        cluster.fork();
      });
    } else {
      console.info(`Cluster server started on ${process.pid}`);
      callback();
    }
  }
}
