import { createResource } from './actions';
import { ResourceForm as SharedResourceForm } from '@/components/resource-form';
import { initialResourceFormState } from '@/lib/resource-form';

type NewResourceFormProps = {
  tagSuggestions?: string[];
};

export function ResourceForm({ tagSuggestions = [] }: NewResourceFormProps) {
  return (
    <SharedResourceForm
      action={createResource}
      initialState={initialResourceFormState}
      submitLabel="教材を保存する"
      tagSuggestions={tagSuggestions}
    />
  );
}
