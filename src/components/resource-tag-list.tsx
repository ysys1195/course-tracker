type ResourceTagListProps = {
  tags: string[];
  emptyLabel?: string;
};

export function ResourceTagList({
  tags,
  emptyLabel = 'タグはまだ設定されていません。',
}: ResourceTagListProps) {
  if (tags.length === 0) {
    return <p className="text-sm leading-6 text-ink/62">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex rounded-full border border-signal/20 bg-signal/10 px-3 py-1 text-sm text-signal"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
