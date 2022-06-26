import React, { useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const theQueryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={theQueryClient}>
      <div id="app-root">
        <h3>Random Bookmarks</h3>
        <Bookmarks />
      </div>
    </QueryClientProvider>
  );
}

function Bookmarks({ bookmarkId }) {
  const { data, error, isLoading } = useQuery(['bookmarks', bookmarkId], () =>
    browser.bookmarks.getChildren(bookmarkId || 'root________'),
  );

  if (error) return error.message;
  if (isLoading) return 'loading...';
  console.log('xxx bookmarks', { data });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data?.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}

function BookmarkItem({ bookmark }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const openBookmark = useCallback(async () => {
    const children = await browser.bookmarks.getChildren(bookmark.id);
    if (!children.length) return;
    while (true) {
      const index = Math.floor(Math.random() * children.length);
      const selectedBookmark = children[index];
      if (selectedBookmark.type === 'bookmark') {
        browser.tabs.create({ url: selectedBookmark.url });
        break;
      }
    }
  }, []);

  if (bookmark.type === 'separator') return null;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          height: '2rem',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <div
          onClick={() => {
            if (bookmark.type !== 'folder') return;
            setIsCollapsed((value) => !value);
          }}
          style={{ width: '2rem', textAlign: 'center' }}
        >
          {bookmark.type === 'folder' ? (isCollapsed ? '>' : 'v') : ''}
        </div>
        <div
          onClick={() => {
            if (bookmark.type !== 'folder') return;
            openBookmark();
          }}
        >
          {bookmark.title}
        </div>
      </div>

      {!isCollapsed && (
        <div style={{ marginLeft: '2rem' }}>
          <Bookmarks bookmarkId={bookmark.id} />
        </div>
      )}
    </div>
  );
}

export default App;
