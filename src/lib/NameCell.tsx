export default function NameCell({children, id}: {children: string; id?: number}) {
  return (
    <>
      <span>{children}</span>
      {id ? <span className="text-[0.64em] font-thin text-gray-500">{' ' + id}</span> : undefined}
    </>
  );
}
