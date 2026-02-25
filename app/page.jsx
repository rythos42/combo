import InputTable from './InputTable';
import OutputTable from './OutputTable';

export default async function Page({ searchParams }) {
  const data = (await searchParams)?.data || '[]';
  const commodityCombo = JSON.parse(data);

  if (!commodityCombo || commodityCombo.length == 0) {
    return <InputTable />
  } else {
    return <OutputTable commodityCombo={commodityCombo} />
  }
}
