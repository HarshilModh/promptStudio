import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, getProject, getProjectById } from "../actions";

export const useGetProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: () => getProject()
    })
}
export const useGetProjectById = (projectId) => {
    return useQuery({
        queryKey: ["projects", projectId],
        queryFn: () => getProjectById(projectId)
    })
}
export const useCreateProject = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (value) => createProject(value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
    })
}