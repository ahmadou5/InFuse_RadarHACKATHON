import { RampView } from "@/views/OnRampView"


export default function ramp ({params} : { params: {
  slug: string
}}) {
return(
  <div className="min-h-screen">
<RampView slug={params.slug}/>
  </div>
)
 
}