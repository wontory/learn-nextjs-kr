'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 선택적으로 에러를 에러 보고 서비스에 기록할 수 있습니다.
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">문제가 발생했습니다!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // 다시 시도하여 인보이스 라우트를 다시 렌더링하는 시도
          () => reset()
        }
      >
        다시 시도
      </button>
    </main>
  );
}
