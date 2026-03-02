import InputTable from './InputTable';
import OutputTable from './OutputTable';

export default async function Page({ searchParams }) {
  const data = (await searchParams)?.data || '[]';
  const inputData = JSON.parse(data);

  if (!inputData.rows || inputData.rows.length == 0) {
    return <InputTable />
  } else {
    return <OutputTable inputData={inputData} />
  }
}
