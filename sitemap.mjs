import { Counter, register, collectDefaultMetrics } from 'prom-client';
import path from 'node:path';
import fs from 'node:fs/promises';
import express from 'express';

// Create an Express application
const app = express();

// Enable collection of default metrics (e.g., CPU, memory, event loop latency)
collectDefaultMetrics();

async function getRoadmapIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/roadmaps'));
}

async function getBestPracticesIds() {
  return fs.readdir(path.join(process.cwd(), 'src/data/best-practices'));
}

export function shouldIndexPage(pageUrl) {
  return ![
    'https://roadmap.sh/404',
    'https://roadmap.sh/terms',
    'https://roadmap.sh/privacy',
    'https://roadmap.sh/pdfs',
    'https://roadmap.sh/g',
  ].includes(pageUrl);
}

export async function serializeSitemap(item) {
  const highPriorityPages = [
    'https://roadmap.sh',
    'https://roadmap.sh/about',
    'https://roadmap.sh/roadmaps',
    'https://roadmap.sh/best-practices',
    'https://roadmap.sh/guides',
    'https://roadmap.sh/videos',
    ...(await getRoadmapIds()).flatMap((id) => [
      `https://roadmap.sh/${id}`,
      `https://roadmap.sh/${id}/topics`,
    ]),
    ...(await getBestPracticesIds()).map(
      (id) => `https://roadmap.sh/best-practices/${id}`
    ),
  ];

  // Increment a counter for each call to serializeSitemap
  metrics.serializeSitemapTotal.inc();

  // Roadmaps and other high priority pages
  for (let pageUrl of highPriorityPages) {
    if (item.url === pageUrl) {
      return {
        ...item,
        // @ts-ignore
        changefreq: 'monthly',
        priority: 1,
      };
    }
  }

  // Guide and video pages
  if (
    item.url.startsWith('https://roadmap.sh/guides') ||
    item.url.startsWith('https://roadmap.sh/videos')
  ) {
    return {
      ...item,
      // @ts-ignore
      changefreq: 'monthly',
      priority: 0.9,
    };
  }

  return undefined;
}

// Define Prometheus metrics
const metrics = {
  serializeSitemapTotal: new Counter({
    name: 'serialize_sitemap_total',
    help: 'Total number of calls to serializeSitemap',
  }),
};

// Expose Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  try {
    const metricsString = await register.metrics();
    res.end(metricsString);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
