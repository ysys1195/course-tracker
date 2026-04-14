import { createResource } from './actions';
import { ResourceForm as SharedResourceForm } from '@/components/resource-form';
import { initialResourceFormState } from '@/lib/resource-form';

export function ResourceForm() {
  return (
    <SharedResourceForm
      action={createResource}
      initialState={initialResourceFormState}
      submitLabel="教材を保存する"
    />
  );
}
