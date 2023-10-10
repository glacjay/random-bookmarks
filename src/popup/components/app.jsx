import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { RandomTab } from './randomTab';

const theQueryClient = new QueryClient();

function usePrevBookmark() {
  const [prevBookmark, setPrevBookmark] = useState(null);
  useEffect(() => {
    const loadPrevBookmark = async () => {
      const results = await browser.storage.local.get('prevBookmark');
      setPrevBookmark(results?.prevBookmark);
    };
    loadPrevBookmark();

    const listener = (changes) => {
      for (const key of Object.keys(changes)) {
        if (key === 'prevBookmark') {
          setPrevBookmark(changes[key].newValue);
        }
      }
    };
    browser.storage.local.onChanged.addListener(listener);
    return () => browser.storage.local.onChanged.removeListener(listener);
  }, []);
  return prevBookmark;
}

function App() {
  const prevBookmark = usePrevBookmark();

  return (
    <QueryClientProvider client={theQueryClient}>
      <div
        id="app-root"
        style={{ display: 'flex', marginRight: 16, flexDirection: 'column' }}
      >
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
                  browser.storage.local.set({ prevBookmark: null });
                }
              }}
            >
              delete
            </button>
          </div>
        )}

        <Bookmarks />

        <RandomTab />
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data?.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}

function BookmarkItem({ bookmark }) {
  const { data: childBookmarks } = useQuery(['bookmarks', bookmark.id], () =>
    browser.bookmarks.getChildren(bookmark.id),
  );

  const [isCollapsed, setIsCollapsed] = useState(true);

  const openBookmark = useCallback(async () => {
    const children = await browser.bookmarks.getChildren(bookmark.id);
    if (!children.length) return;
    let count = 0;
    while (++count < 7) {
      const index = Math.floor(Math.random() * children.length);
      const selectedBookmark = children[index];
      if (selectedBookmark.type === 'bookmark') {
        browser.storage.local.set({ prevBookmark: selectedBookmark });
        browser.tabs.create({ url: selectedBookmark.url });
        window.close();
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
          style={{
            width: '2rem',
            background: '#f8f8f8',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {bookmark.type === 'folder' ? (isCollapsed ? '>' : 'v') : ''}
        </div>

        <div
          onClick={() => {
            if (bookmark.type !== 'folder') return;
            openBookmark();
          }}
          style={{ marginLeft: 4, cursor: 'pointer' }}
        >
          {bookmark.title}
          {!!childBookmarks && (
            <Fragment>
              {' '}
              ({childBookmarks.filter((b) => b.type === 'bookmark').length}/
              {childBookmarks.length})
            </Fragment>
          )}
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
