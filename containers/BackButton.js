import { useRouter } from "next/router";
import { useFlow } from "../context/FlowContext.js";

function BackButton() {
  const { authentication } = useFlow();
  const router = useRouter();
  return (
    <button className="back-arrow" onClick={() => {
      authentication();
      router.push('/')
    }}>&#8592;</button>
  )
}

export default BackButton;