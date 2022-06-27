import React, { useCallback, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const theQueryClient = new QueryClient();

function App() {
  const [prevBookmark, setPrevBookmark] = useState(null);

  return (
    <QueryClientProvider client={theQueryClient}>
      <div id="app-root" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3>Random Bookmarks</h3>

        {!!prevBookmark && (
          <div
            style={{
              display: 'flex',
              width: '80%',
              margin: '0 24px 8px 0',
              borderBottom: '1px solid lightgray',
              paddingBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <a href={prevBookmark.url} style={{ flex: 1 }}>
              {prevBookmark.title}
            </a>
            <button
              onClick={() => {
                const ok = confirm('delete this bookmark?');
                if (ok) {
                  browser.bookmarks.remove(prevBookmark.id);
                  setPrevBookmark(null);
                }
              }}
            >
              delete
            </button>
          </div>
        )}

        <Bookmarks setPrevBookmark={setPrevBookmark} />
      </div>
    </QueryClientProvider>
  );
}

function Bookmarks({ bookmarkId, setPrevBookmark }) {
  const { data, error, isLoading } = useQuery(['bookmarks', bookmarkId], () =>
    browser.bookmarks.getChildren(bookmarkId || 'root________'),
  );

  if (error) return error.message;
  if (isLoading) return 'loading...';
  console.log('xxx bookmarks', { data });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data?.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          setPrevBookmark={setPrevBookmark}
        />
      ))}
    </div>
  );
}

function BookmarkItem({ bookmark, setPrevBookmark }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const openBookmark = useCallback(async () => {
    const children = await browser.bookmarks.getChildren(bookmark.id);
    if (!children.length) return;
    let count = 0;
    while (++count < 7) {
      const index = Math.floor(Math.random() * children.length);
      const selectedBookmark = children[index];
      if (selectedBookmark.type === 'bookmark') {
        setPrevBookmark(selectedBookmark);
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
          <Bookmarks
            bookmarkId={bookmark.id}
            setPrevBookmark={setPrevBookmark}
          />
        </div>
      )}
    </div>
  );
}

export default App;
