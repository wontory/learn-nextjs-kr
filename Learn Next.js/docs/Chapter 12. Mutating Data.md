Chapter 12

# 데이터 변경하기

이전 장에서 URL 검색 매개변수와 Next.js API를 사용하여 검색과 페이지네이션을 구현했습니다. 인보이스 페이지에서는 인보이스를 생성, 업데이트 및 삭제할 수 있는 기능을 추가해보겠습니다!

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - 리액트 서버 액션이란 무엇인지, 그리고 데이터 변경에 어떻게 사용하는지
> - 폼과 서버 컴포넌트 작업 방법.
> - 타입 유효성 검사를 포함한 `formData` 객체 사용 모범 사례.
> - `revalidatePath` API를 사용하여 클라이언트 캐시 재검증하는 방법.
> - 특정 ID를 가진 동적 라우트 세그먼트 생성하는 방법.
> - 낙관적 업데이트를 위해 리액트의 `useFormStatus` 훅 사용 방법.

&nbsp;

---

&nbsp;

## 서버 액션이란 무엇인가요?

리액트 서버 액션은 서버에서 직접 비동기 코드를 실행할 수 있게 해줍니다. 데이터를 변경하기 위해 API 엔드포인트를 만드는 필요성을 없애고, 서버에서 실행되는 비동기 함수를 작성하여 클라이언트 또는 서버 컴포넌트에서 호출할 수 있습니다.

웹 애플리케이션의 보안은 매우 중요합니다. 다양한 위협에 취약할 수 있기 때문입니다. 여기서 서버 액션이 등장합니다. 서버 액션은 POST 요청, 암호화된 클로저, 엄격한 입력 확인, 오류 메시지 해싱, 호스트 제한 등과 같은 기술을 통해 애플리케이션의 안전성을 높이고 데이터를 보호하며 인가된 액세스를 보장합니다.

&nbsp;

---

&nbsp;

## 서버 액션과 함께 폼 사용하기

리액트에서는 `<form>` 요소의 `action` 속성을 사용하여 액션을 호출할 수 있습니다. 이 액션은 캡처된 데이터를 포함하는 네이티브 [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) 객체를 자동으로 받게 됩니다.

예를 들면:

```tsx
// 서버 컴포넌트
export default function Page() {
  // 액션
  async function create(formData: FormData) {
    'use server';

    // 데이터 변경 로직...
  }

  // "action" 속성을 사용하여 액션 호출
  return <form action={create}>...</form>;
}
```

서버 컴포넌트 내에서 서버 액션을 호출하는 장점은 점진적인 향상입니다. 클라이언트에서 JavaScript가 비활성화되어 있더라도 폼이 작동합니다.

&nbsp;

---

&nbsp;

## Next.js와 서버 액션

서버 액션은 Next.js [캐싱](https://nextjs.org/docs/app/building-your-application/caching)과 깊게 통합됩니다. 서버 액션을 통해 폼을 제출하면 데이터를 변경할 뿐만 아니라 `revalidatePath`와 `revalidateTag`와 같은 API를 사용하여 관련 캐시를 재검증할 수도 있습니다.

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지식을 테스트하고 방금 배운 내용을 확인해보세요.
>
> **서버 액션 사용의 이점 중 하나는 무엇인가요?**
>
> - A: SEO 개선.
> - B: 점진적 향상.
> - C: 빠른 웹사이트.
> - D: 데이터 암호화.
>
> &nbsp;
>
> #### 정답 확인
>
> **B: 점진적 향상.**
>
> 정답입니다! 이를 통해 사용자들은 JavaScript가 아직 로드되지 않았거나 로드에 실패했을 때에도 폼과 데이터를 제출할 수 있습니다.

이 모든 것이 어떻게 동작하는지 살펴봅시다!

&nbsp;

---

&nbsp;

## 송장 생성하기

새로운 송장을 생성하는 방법은 다음과 같습니다:

1. 사용자 입력을 받기 위한 양식을 만듭니다.
2. 서버 액션을 생성하고, 양식에서 호출합니다.
3. 서버 액션 내에서 `formData` 객체에서 데이터를 추출합니다.
4. 데이터를 유효성 검사하고 데이터베이스에 삽입할 수 있도록 준비합니다.
5. 데이터를 삽입하고 발생하는 오류를 처리합니다.
6. 캐시를 재검증하고 사용자를 송장 페이지로 리디렉션합니다.

&nbsp;

### 1. 새로운 경로와 양식 생성하기

먼저 `/invoices` 폴더 안에 `/create`라는 새로운 경로 세그먼트와 `page.tsx` 파일을 추가하세요:

![Invoices 폴더에 중첩된 create 폴더와 내부에 있는 page.tsx 파일](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fcreate-invoice-route.png&w=3840&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

이 경로를 사용하여 새로운 송장을 만들 것입니다. `page.tsx` 파일 안에 다음 코드를 붙여넣은 후, 코드를 공부해 보세요:

`/dashboard/invoices/create/page.tsx`

```tsx
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```

이 페이지는 서버 컴포넌트로, `customers`를 가져와 `<Form>` 컴포넌트로 전달합니다. 시간을 절약하기 위해 이미 `<Form>` 컴포넌트를 만들어 두었습니다.

`<Form>` 컴포넌트로 이동하면, 폼이 다음과 같은 구성을 가지고 있음을 확인할 수 있습니다:

- **customers** 목록을 가진 `<select>`(드롭다운) 요소가 있습니다.
- `type="number"`인 **amount**를 위한 `<input>` 요소가 있습니다.
- `type="radio"`인 **status**를 위한 두 개의 `<input>` 요소가 있습니다.
- `type="submit"`인 버튼이 있습니다.

[http://localhost:3000/dashboard/invoices/create](http://localhost:3000/dashboard/invoices/create)에서는 다음과 같은 UI가 표시됩니다:

![Breadcrumbs와 폼이 있는 송장 생성 페이지](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fcreate-invoice-page.png&w=1920&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

&nbsp;

### 2. 서버 액션 생성하기

좋아요, 이제 양식을 제출할 때 호출될 서버 액션을 만들어 봅시다.

`lib` 디렉토리로 이동하여 `actions.ts`라는 새 파일을 생성하세요. 이 파일의 맨 위에 React [`use server`](https://react.dev/reference/react/use-server) 지시문을 추가하세요:

`/app/lib/actions.ts`

```ts
'use server';
```

`'use server'`를 추가함으로써 파일 내의 모든 내보낸 함수를 서버 함수로 표시합니다. 이러한 서버 함수는 클라이언트와 서버 컴포넌트로 가져올 수 있어 매우 다재다능합니다.

액션 내부에 "use server"을 추가하여 서버 컴포넌트 내에서 직접 서버 액션을 작성할 수도 있습니다. 하지만 이 과정에서는 모든 작업을 별도의 파일에 정리하겠습니다.

`actions.ts` 파일 안에 `formData`를 받는 새로운 비동기 함수를 만들어보세요:

`/app/lib/actions.ts`

```ts
'use server';

export async function createInvoice(formData: FormData) {}
```

그런 다음, `<Form>` 컴포넌트에서 `actions.ts` 파일에서 `createInvoice`를 가져옵니다. `<form>` 요소에 `action` 속성을 추가하고, `createInvoice` 액션을 호출하세요.

`/app/ui/invoices/create-form.tsx`

```tsx
'use client';

import { customerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';

export default function Form({
  customers,
}: {
  customers: customerField[];
}) {
  return (
    <form action={createInvoice}>
      // ...
  )
}
```

> **참고**: HTML에서는 `action` 속성에 URL을 전달합니다. 이 URL은 보통 API 엔드포인트인 데이터를 제출해야 하는 대상입니다.  
> 반면 React에서 `action` 속성은 특별한 프롭으로 간주됩니다. React는 이를 기반으로 액션을 호출할 수 있도록 빌드됩니다.  
> 서버 액션은 내부적으로 `POST` API 엔드포인트를 생성합니다. 이것이 서버 액션을 사용할 때 API 엔드포인트를 수동으로 만들 필요가 없는 이유입니다.

&nbsp;

### 3. `formData`에서 데이터 추출하기

`actions.ts` 파일로 돌아가서 `formData`의 값을 추출해야 합니다. [여러 방법](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append) 중에서 이 예제에서는 `.get(name)` 메서드를 사용해 봅시다.

`/app/lib/actions.ts`

```ts
'use server';

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // 테스트해보세요:
  console.log(rawFormData);
}
```

> **팁**: 필드가 많은 폼을 다룰 때는 JavaScript의 [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)와 함께 [`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries) 메서드를 사용하는 것이 좋습니다. 예를 들면:  
> `const rawFormData = Object.fromEntries(formData.entries())`

모든 것이 올바르게 연결되었는지 확인하기 위해 폼을 사용해 보세요. 제출한 후에는 방금 입력한 데이터가 터미널에 로그로 표시됩니다.

이제 데이터가 객체 형태로 되어 있으므로 작업하기가 훨씬 쉬워졌습니다!

&nbsp;

### 4. 데이터 유효성 검사 및 준비

양식 데이터를 데이터베이스에 보내기 전에 올바른 형식과 타입을 가지고 있는지 확인하고 싶을 거에요. 이전에 배운 것처럼, 송장 테이블은 다음과 같은 형식의 데이터일 것입니다:

`/app/lib/definitions.ts`

```ts
export type Invoice = {
  id: string; // 데이터베이스에서 생성될 것
  customer_id: string;
  amount: number; // 센트로 저장됨
  status: 'pending' | 'paid';
  date: string;
};
```

현재는 양식에서 `customer_id`, `amount`, `status`만 가지고 있습니다.

&nbsp;

#### 타입 검사 및 형변환

양식에서 받은 데이터가 데이터베이스에서 기대하는 타입과 일치하는지 확인하는 것이 중요합니다. 예를 들어 액션 안에 `console.log`를 추가하면:

```ts
console.log(typeof rawFormData.amount);
```

`amount`가 `number`가 아닌 `string` 타입이라는 것을 알게 될 것입니다. `input` 요소의 `type="number"`는 사실 숫자가 아닌 문자열을 반환합니다!

타입 검사를 처리하기 위해 여러 가지 방법이 있어요. 수동으로 타입을 검증할 수도 있지만, 타입 검증 라이브러리를 사용하면 시간과 노력을 절약할 수 있어요. 여기서는 TypeScript를 위한 검증 라이브러리인 [Zod](https://zod.dev/)를 사용해 보겠습니다.

`actions.ts` 파일에서 Zod를 가져와서 양식 객체와 일치하는 스키마를 정의하세요. 이 스키마는 데이터를 데이터베이스에 저장하기 전에 `formData`를 유효성 검사할 것입니다.

`/app/lib/actions.ts`

```ts
'use server';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // ...
}
```

`amount` 필드는 명시적으로 문자열에서 숫자로 변환되도록 설정되어 있습니다.

`rawFormData`를 `CreateInvoice`에 전달하여 타입을 유효성 검사할 수 있습니다:

`/app/lib/actions.ts`

```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
}
```

&nbsp;

#### 센트 단위로 값 저장하기

보다 정확한 계산을 위해 자바스크립트 부동 소수점 오류를 제거하고자 데이터베이스에 금액 값을 센트 단위로 저장하는 것이 일반적입니다.

금액을 센트 단위로 변환해 보겠습니다:

`/app/lib/actions.ts`

```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
}
```

&nbsp;

#### 새로운 날짜 생성하기

마지막으로, 송장 작성 날짜를 "YYYY-MM-DD" 형식으로 만들어 보겠습니다:

`/app/lib/actions.ts`

```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
}
```

&nbsp;

### 5. 데이터베이스에 데이터 삽입하기

이제 데이터베이스에 필요한 모든 값을 가지고 있으므로, 새로운 송장을 데이터베이스에 삽입할 SQL 쿼리를 생성하고 변수를 전달할 수 있습니다:

`/app/lib/actions.ts`

```ts
import { z } from 'zod';
import { sql } from '@vercel/postgres';

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`  INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
}
```

현재는 오류를 처리하지 않고 있습니다. 다음 장에서 처리하겠습니다. 지금은 다음 단계로 넘어가보죠.

&nbsp;

### 6. 재검증 및 리디렉션

Next.js에는 사용자 브라우저에 라우트 세그먼트를 저장하는 [클라이언트 측 라우터 캐시](https://nextjs.org/docs/app/building-your-application/caching#router-cache)가 있습니다. 이 캐시는 [사전 로드](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-prefetching)와 함께 사용되어 서버에 대한 요청 수를 줄이면서 사용자가 빠르게 라우트 간 이동할 수 있도록 도와줍니다.

송장 라우트에서 표시되는 데이터를 업데이트하기 때문에 이 캐시를 지우고 서버에 새로운 요청을 보내고 싶어할 것입니다. Next.js의 [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) 함수를 사용하여 이를 할 수 있습니다:

`/app/lib/actions.ts`

```ts
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// ...

export async function createInvoice(formData: FormData) {
  // ...

  revalidatePath('/dashboard/invoices');
}
```

데이터베이스가 업데이트된 후, `/dashboard/invoices` 경로가 재검증되어 서버에서 새로운 데이터를 가져올 것입니다.

이 시점에서 `/dashboard/invoices` 페이지로 사용자를 리디렉션하고 싶을 것입니다. Next.js의 [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect) 함수를 사용하여 이를 할 수 있습니다:

`/app/lib/actions.ts`

```ts
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ...

export async function createInvoice(formData: FormData) {
  // ...

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

축하합니다! 방금 첫 번째 서버 액션을 구현했습니다. 새로운 송장을 추가해 모든 것이 올바르게 작동하는지 테스트해보세요:

1. 제출하면 `/dashboard/invoices` 경로로 리디렉션됩니다.
2. 테이블 상단에 새로운 송장이 표시됩니다.

&nbsp;

---

&nbsp;

## 송장 업데이트하기

송장 업데이트 양식은 송장을 생성하는 양식과 유사하지만, 데이터베이스의 레코드를 업데이트하기 위해 송장 `id`를 전달해야 합니다. 송장 `id`를 가져오고 전달하는 방법을 살펴보겠습니다.

송장을 업데이트하는 단계는 다음과 같습니다:

1. 송장 `id`가 포함된 새로운 동적 라우트 세그먼트를 생성합니다.
2. 페이지 매개변수에서 송장 `id`를 읽어옵니다.
3. 데이터베이스에서 특정 송장을 가져옵니다.
4. 송장 데이터로 양식을 미리 채웁니다.
5. 데이터베이스에서 송장 데이터를 업데이트합니다.

&nbsp;

### 1. 송장 `id`가 포함된 동적 라우트 세그먼트 생성

Next.js에서는 정확한 세그먼트 이름을 모르지만 데이터에 기반하여 라우트를 생성하고 싶을 때 [동적 라우트 세그먼트](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)를 생성할 수 있습니다. 블로그 포스트 제목, 제품 페이지 등에 사용될 수 있습니다. 폴더 이름을 대괄호로 감싸면 동적 라우트 세그먼트를 생성할 수 있습니다. 예를 들면 `[id]`, `[post]`, `[slug]` 등입니다.

`/invoices` 폴더에서 `[id]`라는 새로운 동적 라우트를 생성하고, `edit`라는 `page.tsx` 파일이 있는 새로운 경로를 만드세요. 파일 구조는 다음과 같아야 합니다:

![id 폴더가 포함된 Invoices 폴더와 내부에 edit 폴더가 있는 구조](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fedit-invoice-route.png&w=3840&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

`<Table>` 컴포넌트에서 `<UpdateInvoice />` 버튼이 송장 레코드에서 송장 `id`를 받는 것을 확인할 수 있습니다.

`/app/ui/invoices/table.tsx`

```tsx
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...

    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
      <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}
```

`<UpdateInvoice />` 컴포넌트로 이동하여 `Link`의 `href`를 `id` prop을 받도록 업데이트하세요. 템플릿 리터럴을 사용하여 동적 라우트 세그먼트로 연결할 수 있습니다:

`/app/ui/invoices/buttons.tsx`

```tsx
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
```

&nbsp;

### 2. 페이지 매개변수에서 송장 `id` 읽어오기

다시 `<Page>` 컴포넌트로 돌아가서 다음 코드를 붙여넣으세요:

`/app/dashboard/invoices/[id]/edit/page.tsx`

```tsx
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
```

`/create` 송장 페이지와 유사하지만, 다른 양식(`edit-form.tsx` 파일에서 가져옴)을 가져옵니다. 이 양식은 고객 이름, 송장 금액, 상태의 `defaultValue`가 **미리 채워져야 합니다.** 양식 필드를 미리 채우기 위해서는 `id`를 사용하여 특정 송장을 가져와야 합니다.

페이지 컴포넌트는 `id`에 접근하기 위해 `searchParams` 외에도 `params`라는 프롭을 받을 수 있습니다. `<Page>` 컴포넌트를 업데이트하여 이 프롭을 받도록 하세요:

`/app/dashboard/invoices/[id]/edit/page.tsx`

```tsx
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  // ...
}
```

&nbsp;

### 3. 특정 송장 가져오기

그런 다음:

- `fetchInvoiceById`라는 새로운 함수를 가져와서 `id`를 인수로 전달합니다.
- 드롭다운을 위한 고객 이름을 가져오기 위해서 `fetchCustomers`를 불러옵니다.

`Promise.all`을 사용하여 송장과 고객을 병렬로 가져올 수 있습니다:

`/dashboard/invoices/[id]/edit/page.tsx`

```tsx
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  // ...
}
```

터미널에서 `invoices` 프롭에 대한 임시 TS 오류가 표시됩니다. 이것은 invoices가 잠재적으로 정의되지 않았기 때문에 발생하는 오류입니다. 지금은 걱정하지 마세요. 오류 처리를 추가할 때 다음 챕터에서 해결할 것입니다.

좋아요! 이제 모든 것이 올바르게 연결되었는지 확인해보세요. [http://localhost:3000/dashboard/invoices](http://localhost:3000/dashboard/invoices)를 방문하고 Pencil 아이콘을 클릭하여 송장을 편집해보세요. 이동 후에는 송장 세부 정보가 미리 채워진 양식이 표시되어야 합니다:

![Edit invoices page with breadcrumbs and form](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fedit-invoice-page.png&w=1920&q=75&dpl=dpl_GGugRB3M3WE9C8xcmftCsUL7LkbG)

URL도 `http://localhost:3000/dashboard/invoice/uuid/edit`와 같이 `id`가 업데이트되어야 합니다.

> **UUID vs. 자동 증가 키**  
> 우리는 키를 증가시키지 않고(예: 1, 2, 3 등) UUID를 사용합니다. 이것은 URL을 길게 만들지만 UUID를 사용하면 ID 충돌의 위험이 사라지고 전 세계적으로 고유하며 열거 공격 위험을 줄여 이상적인 대규모 데이터베이스를 만들 수 있습니다.  
> 그러나 더 깔끔한 URL을 원한다면, 자동으로 증가하는 키를 사용하는 것을 선호할 수 있습니다.

&nbsp;

### 4. 서버 액션에 `id` 전달하기

마지막으로, 서버 액션에 `id`를 전달하여 데이터베이스에서 올바른 레코드를 업데이트할 수 있어야 합니다. 다음과 같이 `id`를 인수로 전달할 수는 **없습니다**:

`/app/ui/invoices/edit-form.tsx`

```tsx
// 아래처럼 id를 인수로 전달하는 것은 작동하지 않습니다
<form action={updateInvoice(id)}>
```

대신에, `bind`를 사용하여 `id`를 서버 액션에 전달할 수 있습니다. 이렇게 하면 서버 액션에 전달되는 모든 값이 인코딩됩니다.

`/app/ui/invoices/edit-form.tsx`

```tsx
// ...
import { updateInvoice } from '@/app/lib/actions';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <form action={updateInvoiceWithId}>
      <input type="hidden" name="id" value={invoice.id} />
    </form>
  );
}
```

> **참고**: 양식에 숨겨진 입력 필드를 사용하는 것도 가능합니다 (예: `<input type="hidden" name="id" value={invoice.id} />`). 그러나 이렇게 하면 값이 HTML 소스에 완전한 텍스트로 표시되므로 ID와 같은 중요한 데이터에는 이상적이지 않습니다.

그런 다음 `actions.ts` 파일에서 `updateInvoice`라는 새로운 액션을 만듭니다:

`/app/lib/actions.ts`

```ts
// Zod를 사용하여 예상되는 타입을 업데이트합니다
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`  UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

`createInvoice` 액션과 유사하게 여기서:

1. `formData`에서 데이터를 추출합니다.
2. Zod를 사용하여 타입을 검증합니다.
3. 금액을 센트로 변환합니다.
4. SQL 쿼리에 변수를 전달합니다.
5. 클라이언트 캐시를 지우고 새로운 서버 요청을 보내기 위해 `revalidatePath`를 호출합니다.
6. 송장 페이지로 사용자를 리디렉션하기 위해 `redirect`를 호출합니다.

송장을 편집하여 테스트해보세요. 양식을 제출한 후에는 송장 페이지로 리디렉션되어 송장이 업데이트되어야 합니다.

&nbsp;

---

&nbsp;

## 송장 삭제하기

서버 액션을 사용하여 송장을 삭제하려면 삭제 버튼을 `<form>` 요소로 래핑하고 `bind`를 사용하여 `id`를 서버 액션에 전달하세요:

`/app/ui/invoices/buttons.tsx`

```tsx
import { deleteInvoice } from '@/app/lib/actions';

// ...

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
```

`actions.ts` 파일 내에 `deleteInvoice`라는 새로운 액션을 생성하세요.

`/app/lib/actions.ts`

```ts
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
```

이 액션은 `/dashboard/invoices` 경로에서 호출되기 때문에 `redirect`를 호출할 필요가 없습니다. `revalidatePath`를 호출하면 새로운 서버 요청이 발생하여 테이블을 다시 렌더링합니다.

&nbsp;

---

&nbsp;

## 추가 학습 자료

이번 장에서는 서버 액션을 사용하여 데이터를 변경하는 방법을 배웠습니다. 또한 Next.js 캐시를 다시 유효화하는 `revalidatePath` API와 사용자를 새 페이지로 리디렉션하는 `redirect`에 대해 알아보았습니다.

추가적인 학습을 위해 [Server Actions와 보안](https://nextjs.org/blog/security-nextjs-server-components-actions)에 대해 더 읽어볼 수도 있습니다.
