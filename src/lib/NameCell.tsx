export default function NameCell({id, value}: {id?: number; value: string}) {
  return (
    <>
      <span>{value}</span>
      {id ? <span className="text-[0.64em] font-thin text-gray-500">{' ' + id}</span> : undefined}
    </>
  );
}
