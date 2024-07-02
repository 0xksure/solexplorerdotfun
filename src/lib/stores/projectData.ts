import { writable, derived } from 'svelte/store';
import { fetchProfiles, fetchProfileDetails } from '$lib/utils/api';

// Define types
type Project = {
    id: string;
    name: string;
    profileType: {
        name: string;
    };
    profileSector: {
        name: string;
    };
    profileStatus: {
        name: string;
    };
    foundingDate: string;
    descriptionShort: string;
    tagLine: string;
    urlMain: string;
};
type ProjectDetails = Project & {
    descriptionLong: string;
    urlBlog: string;
    urlDocumentation: string;
    urlWhitepaper: string;
    products: any[];
    assets: any[];
    socials: any[];
};

type Asset = {
    id: number;
    name: string;
    ticker: string;
    assetType: {
        name: string;
    };
    shortDescription: string;
    address: string;
    // assetStandard has been removed
};

// Create stores
export const projects = writable<Project[]>([]);
export const selectedProjects = writable<string[]>([]);
export const projectDetails = writable<{ [key: string]: ProjectDetails }>({});


export const searchTerm = writable('');
export const selectedSector = writable('');
export const selectedStatus = writable('');
export const selectedNetwork = writable('');

export const filteredProjects = derived(
    [projects, searchTerm, selectedSector, selectedStatus, selectedNetwork],
    ([$projects, $searchTerm, $selectedSector, $selectedStatus, $selectedNetwork]) => {
        return $projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes($searchTerm.toLowerCase()) ||
                project.descriptionShort.toLowerCase().includes($searchTerm.toLowerCase());
            const matchesSector = $selectedSector ? project.profileSector?.name === $selectedSector : true;
            const matchesStatus = $selectedStatus ? project.profileStatus.name === $selectedStatus : true;
            const matchesNetwork = $selectedNetwork ? project.products.some(p => p.productDeployedOnProduct.name === $selectedNetwork) : true;

            return matchesSearch && matchesSector && matchesStatus && matchesNetwork;
        });
    }
);

export async function loadProjects() {
    try {
        const data = await fetchProfiles();
        projects.set(data);
    } catch (error) {
        console.error('Error loading projects:', error);
        throw error;
    }
}



// Function to load project details
export async function loadProjectDetails(id: string) {
    try {
        const data = await fetchProfileDetails(id);
        projectDetails.update(details => ({ ...details, [id]: data }));
    } catch (error) {
        console.error('Error loading project details:', error);
        throw error;
    }
}

// Function to add a project to comparison
export function addToComparison(projectId: string) {
    selectedProjects.update(selected => {
        if (!selected.includes(projectId)) {
            return [...selected, projectId];
        }
        return selected;
    });
}

// Function to remove a project from comparison
export function removeFromComparison(projectId: string) {
    selectedProjects.update(selected => selected.filter(id => id !== projectId));
}

// Function to clear comparison
export function clearComparison() {
    selectedProjects.set([]);
}