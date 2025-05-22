import { iFooter } from '@/lib/types';
import { createClient, EntrySkeletonType } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error('Contentful space and access token must be provided.');
}

const client = createClient({
  space: space,
  accessToken: accessToken,
});

export interface iContentfulPagePros {
  title: string;
  url: string;
  subtitle: string;
}

// Define the type for a generic Contentful entry
export interface iContentfulEntry<T> {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: T;
}

// Function to fetch all entries of a content type
export async function getAllPages<T extends EntrySkeletonType>(
  contentType: string
): Promise<iContentfulEntry<T>[]> {
  try {
    const entries = await client.getEntries<T>({
      content_type: contentType,
    });
    return entries.items.map((entry) => ({
      sys: {
        id: entry.sys.id,
        contentType: {
          sys: {
            id: entry.sys.contentType.sys.id,
          },
        },
      },
      fields: entry.fields as T,
    })) as iContentfulEntry<T>[];
  } catch (error) {
    console.error(
      `Error fetching entries for content type ${contentType}:`,
      error
    );
    return [];
  }
}

// Function to fetch a single entry of a content type
export async function getContentType(
  contentType: string
): Promise<iFooter | null> {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      limit: 1, // Limit to one entry since we're fetching a single footer
    });

    if (entries.items.length > 0) {
      const entry = entries.items[0];
      return entry.fields as unknown as iFooter;
    } else {
      throw new Error(`No entry found for content type ${contentType}`);
    }
  } catch (error) {
    console.error(
      `Error fetching entry for content type ${contentType}:`,
      error
    );
    return null;
  }
}

// Function to get page props by URL
export async function getPageProps<T>(url: string): Promise<T | null> {
  try {
    const pages = await getAllPages<any>('pageComponent');
    const page = pages.find((p) => p.fields.url === url);

    if (page) {
      return page.fields as T;
    } else {
      console.log(`Page with URL ${url} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching page props:`, error);
    return null;
  }
}
