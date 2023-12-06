Chapter 14

# 접근성 향상

이전 장에서는 오류(404 오류 포함)를 잡고 사용자에게 대체 콘텐츠를 표시하는 방법을 살펴보았습니다. 그러나 우리는 폼 유효성 검사라는 아직 해결해야 할 퍼즐 조각이 있습니다. Server Actions를 사용하여 서버 측 유효성 검사를 구현하고, `useFormState` 훅을 사용하여 어떻게 폼 오류를 보여줄 수 있는지 살펴봅시다. 그리고 이 모든 것을 할 때 접근성을 고려해봅시다!

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - Next.js에서 eslint-plugin-jsx-a11y를 사용하여 접근성을 향상시키는 방법.
> - 서버 측 폼 유효성 검사를 구현하는 방법.
> - React의 useFormState 훅을 사용하여 폼 오류를 처리하고 사용자에게 표시하는 방법.

&nbsp;

---

&nbsp;

## 접근성이란 무엇인가요?

접근성은 장애를 가진 사람들을 포함하여 모든 사람이 사용할 수 있는 웹 애플리케이션을 디자인하고 구현하는 것을 말합니다. 키보드 탐색, 시멘틱 HTML, 이미지, 색상, 비디오 등 많은 영역을 포함하는 방대한 주제입니다.

이 강의에서는 접근성에 대해 심도 있게 다루지는 않겠지만, Next.js에서 제공되는 접근성 기능과 여러분의 애플리케이션을 보다 접근성 있게 만들기 위한 몇 가지 일반적인 방법을 논의할 것입니다.

> 접근성에 대해 더 알고 싶다면 [web.dev](https://web.dev/)에서 제공하는 [접근성 학습](https://web.dev/learn/accessibility/) 코스를 추천합니다.

&nbsp;

---

&nbsp;

## Next.js에서 ESLint 접근성 플러그인 사용하기

기본적으로 Next.js에는 [`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) 플러그인이 포함되어 있어 접근성 문제를 빠르게 잡아줍니다. 예를 들어, 이 플러그인은 `alt` 텍스트 없는 이미지, `aria-*` 및 `role` 속성의 잘못된 사용 등에 대해 경고합니다.

이것이 어떻게 작동하는지 살펴봅시다!

`package.json` 파일에 `next lint`를 스크립트로 추가해보세요:

`/package.json`

```json
"scripts": {
    "build": "next build",
    "dev": "next dev",
    "seed": "node -r dotenv/config ./scripts/seed.js",
    "start": "next start",
    "lint": "next lint"
},
```

그런 다음 터미널에서 `npm run lint`를 실행해보세요:

`터미널`

```bash
npm run lint
```

다음과 같은 경고가 표시되어야 합니다:

`터미널`

```bash
✔ ESLint 경고나 오류 없음
```

하지만 `alt` 태그 없이 이미지를 사용한다면 어떻게 될까요? 알아봅시다!

`/app/ui/invoices/table.tsx`로 이동하여 이미지에서 `alt` 태그를 제거해보세요. 에디터의 검색 기능을 사용하여 빠르게 이미지 태그를 찾을 수 있습니다:

`/app/ui/invoices/table.tsx`

```tsx
<Image
  src={invoice.image_url}
  className="rounded-full"
  width={28}
  height={28}
  alt={`${invoice.name}'s profile picture`} // 이 줄을 삭제하세요
/>
```

그런 다음 다시 `npm run lint`를 실행해보세요. 다음과 같은 경고가 표시될 것입니다:

`터미널`

```bash
./app/ui/invoices/table.tsx
45:25  경고: Image elements must have an alt prop,
either with meaningful text, or an empty string for decorative images. jsx-a11y/alt-text
```

이 경고는 애플리케이션을 Vercel에 배포하려고 할 때도 빌드 로그에 표시될 것입니다. 왜냐하면 `next lint`가 빌드 프로세스의 일부로 실행되기 때문입니다. 따라서 애플리케이션을 배포하기 전에 로컬에서 `lint`를 실행하여 접근성 문제를 잡을 수 있습니다.

&nbsp;

---

&nbsp;

## 폼 접근성 향상

우리의 폼에서 이미 개선하고 있는 세 가지 접근성 관련 사항은 다음과 같습니다:

- **시멘틱 HTML**: `<div>` 대신 `<input>`, `<option>` 등의 의미를 포함하는 요소를 사용합니다. 이는 보조 기술(AT)이 입력 요소에 집중하고 사용자에게 적절한 문맥 정보를 제공하여 폼을 더 쉽게 탐색하고 이해할 수 있도록 합니다.
- **라벨링**: `<label>`과 `htmlFor` 속성을 포함하여 각 폼 필드에 설명적인 텍스트 라벨을 제공합니다. 이는 컨텍스트를 제공함으로써 AT 지원을 향상시키고 또한 라벨을 클릭하여 해당 입력 필드에 포커스를 맞출 수 있도록하여 사용성을 향상시킵니다.
- **아웃라인 포커싱**: 필드들은 포커스 상태일 때 아웃라인을 제대로 표시하도록 스타일이 지정되어 있습니다. 이는 키보드 및 스크린 리더 사용자 모두에게 페이지의 활성 요소를 시각적으로 나타내어 어디에 있는지 이해할 수 있도록 도와줍니다. `Tab`을 눌러 확인할 수 있습니다.

이러한 실천 방법은 여러 사용자에게 폼을 더 접근성 있게 만드는 데 좋은 기반을 제공합니다. 그러나 이는 **폼 유효성 검사**와 **오류**에 대한 것은 다루지 않습니다.

&nbsp;

---

&nbsp;

## 폼 유효성 검사

[http://localhost:3000/dashboard/invoices/create](http://localhost:3000/dashboard/invoices/create)로 이동하여 빈 폼을 제출해보세요. 무슨 일이 일어나나요?

에러가 발생합니다! 이는 빈 폼 값을 서버 액션에 보내기 때문입니다. 이를 방지하려면 폼을 클라이언트나 서버에서 유효성 검사하는 것이 좋습니다.

&nbsp;

### 클라이언트 측 유효성 검사

클라이언트에서 폼을 유효성 검사하는 몇 가지 방법이 있습니다. 가장 간단한 방법은 `<input>` 및 `<select>` 요소에 `required` 속성을 추가하여 브라우저가 제공하는 폼 유효성을 사용하는 것입니다. 예를 들면:

`/app/ui/invoices/create-form.tsx`

```tsx
<input
  id="amount"
  name="amount"
  type="number"
  placeholder="USD 금액 입력"
  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  required
/>
```

폼을 다시 제출해보세요. 빈 값을 가진 폼을 제출하려고 하면 브라우저에서 경고가 표시됩니다.

이 접근 방식은 대부분의 보조 기술(AT)이 브라우저 유효성 검사를 지원하기 때문에 일반적으로 괜찮습니다.

클라이언트 측 유효성 검사의 대안은 서버 측 유효성 검사입니다. 다음 섹션에서 이를 어떻게 구현할 수 있는지 살펴봅시다. 지금은, `required` 속성을 추가한 경우 삭제하세요.

&nbsp;

### 서버 측 유효성 검사

서버에서 폼을 유효성을 검사하면 다음과 같은 이점을 얻을 수 있습니다:

- 데이터가 데이터베이스로 전송되기 전에 예상한 형식으로 있는지 확인할 수 있습니다.
- 악의적인 사용자가 클라이언트 측 유효성 검사를 우회하는 위험을 줄일 수 있습니다.
- 유효한 데이터로 간주되는 내용에 대해 단일 진실의 원천이 됩니다.

`create-form.tsx` 컴포넌트에서 `react-dom`으로부터 `useFormState` 훅을 가져옵니다. `useFormState`는 훅이기 때문에 `"use client"` 지시문을 사용하여 폼을 클라이언트 컴포넌트로 변환해야 합니다:

`/app/ui/invoices/create-form.tsx`

```tsx
'use client';

// ...
import { useFormState } from 'react-dom';
```

폼 컴포넌트 내에서 `useFormState` 훅:

- 두 가지 인자를 받습니다: `(action, initialState)`.
- 두 개의 값을 반환합니다: `[state, dispatch]` - 폼 상태와 dispatch 함수 ([useReducer](https://react.dev/reference/react/useReducer)와 유사함)

`createInvoice` 액션을 `useFormState`의 인자로 전달하고, `<form action={}>` 속성 내에서 `dispatch`를 호출하세요.

`/app/ui/invoices/create-form.tsx`

```tsx
// ...
import { useFormState } from 'react-dom';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const [state, dispatch] = useFormState(createInvoice, initialState);

  return <form action={dispatch}>...</form>;
}
```

`initialState`는 여러분이 정의할 수 있는 무엇이든 될 수 있습니다. 이 경우에는 `message`와 `errors`를 가진 빈 객체를 만들어보세요.

`/app/ui/invoices/create-form.tsx`

```tsx
// ...
import { useFormState } from 'react-dom';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createInvoice, initialState);

  return <form action={dispatch}>...</form>;
}
```

처음에는 혼란스러워 보일 수 있지만, 서버 액션을 업데이트하면 더 많은 의미를 갖게 됩니다. 이제 그것을 해봅시다.

`action.ts` 파일에서 Zod를 사용하여 폼 데이터를 유효성 검사할 수 있습니다. 다음과 같이 `FormSchema`를 업데이트하세요:

`/app/lib/action.ts`

```ts
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: '고객을 선택하세요.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: '0달러보다 높은 금액을 입력하세요.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '송장 상태를 선택하세요.',
  }),
  date: z.string(),
});
```

- `customerId` - Zod는 고객 필드가 비어있는 경우 이미 오류를 throw합니다. 그러나 사용자가 고객을 선택하지 않은 경우에 대해서 친절한 메시지를 추가해봅시다.
- `amount` - 금액 유형을 `string`에서 `number`로 형변환하고 있으므로, 문자열이 비어 있으면 기본적으로 0이 될 것입니다. Zod에게 항상 0보다 큰 금액을 원한다고 알려주기 위해 `.gt()` 함수를 사용해보세요.
- `status` - Zod는 상태 필드가 비어있는 경우 이미 오류를 throw합니다. "pending" 또는 "paid"를 예상하고 있으므로 사용자가 상태를 선택하지 않은 경우에 대한 메시지도 친절하게 추가해봅시다.

다음으로, `createInvoice` 액션을 두 개의 매개변수를 받도록 업데이트하세요:

`/app/lib/actions.ts`

```ts
// 이것은 @types/react-dom이 업데이트 될 때까지 임시 조치입니다.
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // ...
}
```

- `formData` - 이전과 같습니다.
- `prevState` - `useFormState` 훅에서 전달된 상태를 포함합니다. 이 예제에서는 액션에서 사용하지 않지만 필수 속성입니다.

그런 다음 Zod `parse()` 함수를 `safeParse()`로 변경하세요:

`/app/lib/actions.ts`

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zod를 사용하여 폼 필드 유효성 검사
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // ...
}
```

`safeParse()`는 `success` 또는 `error` 필드를 포함하는 객체를 반환합니다. 이는 `try/catch` 블록 내부에 이러한 로직을 넣지 않고도 유효성 검사를 더 우아하게 처리하는 데 도움이 될 것입니다.

데이터를 데이터베이스로 전송하기 전에 폼 필드가 올바르게 유효성 검사되었는지 확인하기 위해 조건문을 사용하세요:

`/app/lib/actions.ts`

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zod를 사용하여 폼 필드 유효성 검사
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 만약 폼 유효성 검사에 실패하면, 즉시 에러를 반환합니다. 그렇지 않으면 계속 진행합니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 없습니다. 송장을 생성하지 못했습니다.',
    };
  }

  // ...
}
```

`validatedFields`가 성공적이지 않으면, 우리는 Zod에서 가져온 에러 메시지와 함께 함수를 빠르게 종료합니다.

> **팁:** `validatedFields`를 console.log하고, 빈 폼을 제출하여 그 형태를 확인해보세요.

마지막으로, 폼 유효성을 별도로 처리하고 있는데, try/catch 블록 외부에서 폼 유효성 검사를 처리하고 있으므로, 데이터베이스 에러에 대한 특정 메시지를 반환할 수 있습니다. 최종 코드는 이렇게 보일 것입니다:

`/app/lib/actions.ts`

```ts
export async function createInvoice(prevState: State, formData: FormData) {
  // Zod를 사용하여 폼 유효성 검사
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // 만약 폼 유효성 검사에 실패하면, 즉시 에러를 반환합니다. 그렇지 않으면 계속 진행합니다.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '필수 항목이 없습니다. 송장 생성에 실패했습니다.',
    };
  }

  // 데이터베이스에 삽입할 데이터 준비
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // 데이터베이스에 데이터 삽입
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // 데이터베이스 에러가 발생한 경우, 더 구체적인 에러를 반환합니다.
    return {
      message: '데이터베이스 오류: 송장 생성에 실패했습니다.',
    };
  }

  // 송장 페이지의 캐시를 다시 검증하고 사용자를 리디렉션합니다.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

좋아요, 이제 폼 컴포넌트에서 에러를 표시합시다. `create-form.tsx` 컴포넌트로 돌아가서, 폼의 `state`를 사용하여 에러에 접근할 수 있습니다.

각 구체적인 에러를 확인하는 **삼항 연산자**를 추가하세요. 예를 들어, 고객 필드 이후에 다음과 같이 추가할 수 있습니다:

`/app/ui/invoices/create-form.tsx`

```tsx
<form action={dispatch}>
  <div className="rounded-md bg-gray-50 p-4 md:p-6">
    {/* 고객 이름 */}
    <div className="mb-4">
      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
        고객 선택
      </label>
      <div className="relative">
        <select
          id="customer"
          name="customerId"
          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
          aria-describedby="customer-error"
        >
          <option value="" disabled>
            고객 선택
          </option>
          {customerNames.map((name) => (
            <option key={name.id} value={name.id}>
              {name.name}
            </option>
          ))}
        </select>
        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
      </div>
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.customerId &&
          state.errors.customerId.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
    </div>
    // ...
  </div>
</form>
```

> **팁:** 컴포넌트 내에서 `state`를 console.log하여 모든 것이 올바르게 연결되었는지 확인할 수 있습니다. 폼이 이제 클라이언트 컴포넌트로 변경되었으므로 개발 도구의 콘솔을 확인하세요.

위 코드에서 또한 다음과 같은 aria 라벨을 추가하고 있습니다:

- `aria-describedby="customer-error"`: 이는 `select` 요소와 에러 메시지 컨테이너 간의 관계를 설정합니다. `id="customer-error"`인 컨테이너가 `select` 요소를 설명한다는 것을 나타냅니다. 사용자가 `select` 상자와 상호 작용할 때, 스크린 리더는 에러를 알리기 위해 이 설명을 읽습니다.
- `id="customer-error"`: 이 `id` 속성은 `select` 입력의 에러 메시지를 보유하는 HTML 요소를 고유하게 식별합니다. 이는 aria-describedby가 관계를 설정하기 위해 필요합니다.
- `aria-live="polite"`: 스크린 리더는 `div` 내부의 에러가 업데이트될 때 사용자에게 정중하게 알려줍니다. 내용이 변경되면(예: 사용자가 에러를 수정할 때) 이 변경 사항을 알리지만 사용자를 방해하지 않도록 합니다.

&nbsp;

# 실습: aria 라벨 추가

위의 예제를 사용하여 남은 폼 필드에 에러를 추가하세요. 또한 어떤 필드가 누락되었을 경우 폼 하단에 메시지를 표시하세요. 화면은 다음과 같이 보여야 합니다:

![각 필드에 대한 에러 메시지가 표시된 송장 생성 폼](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fform-validation-page.png&w=1920&q=75&dpl=dpl_BX2Me1GKtMsJfVE8RLJUjnZyiNgh)

준비가 되면 `npm run lint`를 실행하여 aria 라벨을 올바르게 사용했는지 확인하세요.

더 도전해보고 싶다면, 이 장에서 배운 내용을 활용하여 `edit-form.tsx` 컴포넌트에도 폼 유효성 검사를 추가하세요.

다음을 수행해야합니다:

- `edit-form.tsx` 컴포넌트에 `useFormState`를 추가하세요.
- Zod에서 유효성 검사 에러를 처리하도록 `updateInvoice` 액션을 수정하세요.
- 컴포넌트에 에러를 표시하고, 접근성을 향상시키기 위해 aria 라벨을 추가하세요.

준비가 되면 아래의 코드 스니펫을 확장하여 솔루션을 확인하세요:

&nbsp;

<details>

<summary> <strong>솔루션 보기</strong></summary>

**송장 수정 폼:**

`/app/ui/invoices/edit-form.tsx`

```tsx
export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, dispatch] = useFormState(updateInvoiceWithId, initialState);

  return <form action={dispatch}></form>;
}
```

**서버 액션:**

`/app/lib/actions.ts`

```ts
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

</details>
