제 13장

# 에러 처리

이전 장에서 서버 액션을 사용하여 데이터를 변경하는 방법을 배웠습니다. 자바스크립트의 `try/catch` 문과 Next.js API를 사용하여 에러를 _우아하게_ 처리하는 방법을 알아봅시다.

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - 라우트 세그먼트에서 에러를 잡고 사용자에게 대체 UI를 보여주기 위해 특별한 `error.tsx` 파일을 사용하는 방법
> - 존재하지 않는 리소스에 대한 404 에러를 처리하기 위해 `notFound` 함수와 `not-found` 파일을 사용하는 방법

&nbsp;

---

&nbsp;

## 서버 액션에 `try/catch` 추가하기

먼저 서버 액션에 자바스크립트의 `try/catch` 문을 추가하여 에러를 우아하게 처리해봅시다.

이미 이를 알고 계시다면, 몇 분을 투자하여 서버 액션을 업데이트하거나 아래 코드를 복사할 수 있습니다:

&nbsp;

<details>

<summary> <strong>솔루션 보기</strong></summary>

`/app/lib/actions.ts`

```ts
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: '데이터베이스 오류: 인보이스 생성에 실패했습니다.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

</details>

&nbsp;

<details>

<summary> <strong>솔루션 보기</strong></summary>

`/app/lib/actions.ts`

```ts
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: '데이터베이스 오류: 인보이스 업데이트에 실패했습니다.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

</details>

&nbsp;

<details>

<summary> <strong>솔루션 보기</strong></summary>

`/app/lib/actions.ts`

```ts
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: '인보이스가 삭제되었습니다.' };
  } catch (error) {
    return { message: '데이터베이스 오류: 인보이스 삭제에 실패했습니다.' };
  }
}
```

</details>

&nbsp;

`redirect`가 `try/catch` 블록 외부에서 호출되는 것을 주목하세요. 이는 `redirect`가 에러를 던지는 방식으로 작동하기 때문에 `catch` 블록에서 잡힐 것입니다. 이를 피하기 위해 `try/catch` 이후에 `redirect`를 호출할 수 있습니다. `redirect`는 `try`가 성공했을 때에만 도달 가능합니다.

이제 서버 액션에서 에러가 발생했을 때의 동작을 확인해보겠습니다. 이를 위해 이전보다 더 일찍 에러를 던져서 확인할 수 있습니다. 예를 들어, `deleteInvoice` 액션에서 함수 상단에 에러를 던져보세요:

`/app/lib/actions.ts`

```ts
export async function deleteInvoice(id: string) {
  throw new Error('인보이스 삭제에 실패했습니다.');

  // 도달할 수 없는 코드 블록
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: '인보이스가 삭제되었습니다.' };
  } catch (error) {
    return { message: '데이터베이스 오류: 인보이스 삭제에 실패했습니다.' };
  }
}
```

인보이스를 삭제하려고 시도하면 로컬호스트에서 에러가 표시될 것입니다.

이러한 에러는 개발 중에 잠재적인 문제를 조기에 발견할 수 있어 도움이 됩니다. 하지만 갑작스러운 실패를 피하고 애플리케이션을 계속 실행할 수 있도록 사용자에게 에러를 표시하고 싶을 것입니다.

여기서 Next.js의 [`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error) 파일이 등장합니다.

&nbsp;

---

&nbsp;

## `error.tsx`로 모든 에러 처리하기

`error.tsx` 파일은 라우트 세그먼트에 대한 UI 경계를 정의하는 데 사용될 수 있습니다. 예기치 않은 에러에 대한 **전체 캐치** 역할을 하며 사용자에게 대체 UI를 표시할 수 있습니다.

`/dashboard/invoices` 폴더 내부에 새로운 파일 `error.tsx`를 만들고 다음 코드를 붙여넣어보세요:

`/dashboard/invoices/error.tsx`

```tsx
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
```

위 코드에 대해 몇 가지 주목할 점이 있습니다:

- **"use client"** - `error.tsx`는 클라이언트 컴포넌트여야 합니다.
- 두 가지 프롭을 받습니다:
  - `error`: 이 객체는 자바스크립트의 네이티브 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 객체의 인스턴스입니다.
  - `reset`: 이는 에러 경계를 재설정하기 위한 함수입니다. 실행되면 함수가 라우트 세그먼트를 다시 렌더링하려고 시도합니다.

인보이스를 다시 삭제하려고 하면 다음과 같은 UI가 표시될 것입니다:

![error.tsx 파일이 수용하는 프롭을 보여주는 이미지](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Ferror-page.png&w=1920&q=75&dpl=dpl_8s8Dnm8T2UqYs4Sz3a1AK4vKuj5w)

&nbsp;

---

&nbsp;

## `notFound` 함수로 404 에러 처리하기

에러를 우아하게 처리하는 다른 방법으로 `notFound` 함수를 사용하는 것이 있습니다. `error.tsx`가 **모든** 에러를 잡는 데 유용하다면, `notFound`는 존재하지 않는 리소스를 가져오려고 할 때 사용할 수 있습니다.

예를 들어, [http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit](http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit)를 방문해보세요.

이것은 데이터베이스에 존재하지 않는 가짜 UUID입니다.

이것은 `error.tsx`가 정의되어있는 `/invoices`의 자식 라우트이기 때문에 `error.tsx`가 바로 튀어나오는 것을 바로 확인할 수 있습니다.

그러나 좀 더 구체적으로 처리하고 싶다면, 사용자에게 접근하려는 리소스가 찾을 수 없음을 알려주기 위해 404 에러를 표시할 수 있습니다.

`data.ts`의 `fetchInvoiceById` 함수로 이동하고 반환된 `송장`을 콘솔에서 기록하여 리소스를 찾지 못했음을 확인할 수 있습니다.:

`/app/lib/data.ts`

```ts
export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    // ...

    console.log(invoice); // 인보이스는 빈 배열입니다 []
    return invoice[0];
  } catch (error) {
    console.error('데이터베이스 오류:', error);
    throw new Error('인보이스를 가져오는 데 실패했습니다.');
  }
}
```

이제 데이터베이스에 인보이스가 존재하지 않음을 알게 되었습니다. 이를 처리하기 위해 `notFound`를 사용해봅시다. `/dashboard/invoices/[id]/edit/page.tsx`로 이동하고 `'next/navigation'`에서 `{ notFound }`를 import하세요.

그런 다음, 인보이스가 존재하지 않는 경우 `notFound`를 호출할 수 있는 조건문을 사용할 수 있습니다:

`/dashboard/invoices/[id]/edit/page.tsx`

```tsx
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  // ...
}
```

좋습니다! `<Page>`는 이제 특정 인보이스가 없는 경우 에러를 던질 것입니다. 사용자에게 에러 UI를 표시하기 위해 `/edit` 폴더 내에 `not-found.tsx` 파일을 생성하세요.

![edit 폴더 내의 not-found.tsx 파일](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fnot-found-file.png&w=3840&q=75&dpl=dpl_8s8Dnm8T2UqYs4Sz3a1AK4vKuj5w)

그런 다음, `not-found.tsx` 파일 내에 다음 코드를 붙여넣어보세요:

`/dashboard/invoices/[id]/edit/not-found.tsx`

```tsx
import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>요청한 인보이스를 찾을 수 없습니다.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        뒤로 가기
      </Link>
    </main>
  );
}
```

라우트를 새로고침하면 다음의 UI가 표시됩니다:

![404 Not Found 페이지](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2F404-not-found-page.png&w=1920&q=75&dpl=dpl_8s8Dnm8T2UqYs4Sz3a1AK4vKuj5w)

이것은 기억해야 할 중요한 점입니다. `notFound`는 `error.tsx`보다 우선순위가 있으므로 더 구체적인 에러를 처리하려고 할 때 `notFound`를 활용할 수 있습니다!

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **Next.js에서 라우트 세그먼트의 예기치 않은 에러를 캐치하는 데 사용되는 파일은 무엇인가요?**
>
> - A: 404.tsx
> - B: not-found.tsx
> - C: error.tsx
> - D: catch-all.tsx
>
> &nbsp;
>
> **정답 확인**
>
> **C: error.tsx**
>
> `error.ts` 파일은 예상치 못한 오류를 모두 캐치하고 사용자에게 대체 UI를 표시할 수 있는 역할을 합니다.

&nbsp;

---

&nbsp;

## 추가 자료

Next.js에서 에러 처리에 대해 더 알고 싶다면 아래 문서를 확인해보세요:

- [에러 처리](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [`error.js` API 레퍼런스](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [`notFound()` API 레퍼런스](https://nextjs.org/docs/app/api-reference/functions/not-found)
- [`not-found.js` API 레퍼런스](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
