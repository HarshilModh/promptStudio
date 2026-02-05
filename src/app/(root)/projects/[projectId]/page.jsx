import React from 'react'
import ProjectView from '@/modules/projects/components/project-view'
const page = async ({params}) => {
    const {projectId}=await params;
  return (
    <ProjectView projectId={projectId}/>
  )
}

export default page