import { PipelineToolbar } from './competence/toolbar/toolbar';
import { PipelineUI } from './competence/work-flow/ui';
import { SubmitButton } from './competence/work-flow/submit';

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
