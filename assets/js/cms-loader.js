// CMS Content Loader
class CMSLoader {
    constructor() {
        this.loadContent();
    }

    async loadContent() {
        try {
            await Promise.all([
                this.loadHeroContent(),
                this.loadAboutContent(),
                this.loadContactContent(),
                this.loadSkills(),
                this.loadProjects()
            ]);
        } catch (error) {
            console.warn('CMS content loading failed, using fallback content:', error);
        }
    }

    async loadHeroContent() {
        try {
            const response = await fetch('/content/hero.md');
            if (!response.ok) throw new Error('Hero content not found');
            
            const content = await response.text();
            const data = this.parseFrontMatter(content);
            
            const nameElement = document.querySelector('.hero-title');
            const titleElement = document.querySelector('.hero-subtitle');
            
            if (nameElement && data.name) nameElement.textContent = data.name;
            if (titleElement && data.title) titleElement.textContent = data.title;
        } catch (error) {
            console.warn('Failed to load hero content:', error);
        }
    }

    async loadAboutContent() {
        try {
            const response = await fetch('/content/about.md');
            if (!response.ok) throw new Error('About content not found');
            
            const content = await response.text();
            const data = this.parseFrontMatter(content);
            
            const sectionTitle = document.querySelector('#about .section-title');
            const aboutText = document.querySelector('.about-text');
            const profileImage = document.querySelector('.about-image img');
            const resumeLink = document.querySelector('.resume-btn');
            
            if (sectionTitle && data.title) sectionTitle.textContent = data.title;
            if (profileImage && data.image) profileImage.src = data.image;
            if (resumeLink && data.resume) resumeLink.href = data.resume;
            
            if (aboutText && (data.description1 || data.description2)) {
                aboutText.innerHTML = `
                    ${data.description1 ? `<p>${data.description1}</p><br>` : ''}
                    ${data.description2 ? `<p>${data.description2}</p><br>` : ''}
                    <div class="resume-section">
                        <a href="${data.resume || '#'}" download class="resume-btn">
                            <i class="fas fa-download"></i> Download Resume
                        </a>
                    </div>
                `;
            }
        } catch (error) {
            console.warn('Failed to load about content:', error);
        }
    }

    async loadContactContent() {
        try {
            const response = await fetch('/content/contact.md');
            if (!response.ok) throw new Error('Contact content not found');
            
            const content = await response.text();
            const data = this.parseFrontMatter(content);
            
            const contactTitle = document.querySelector('#contact .section-title');
            const contactDesc = document.querySelector('#contact p');
            const emailLink = document.querySelector('a[href*="mailto"]');
            const githubLink = document.querySelector('a[href*="github"]');
            const linkedinLink = document.querySelector('a[href*="linkedin"]');
            
            if (contactTitle && data.title) contactTitle.textContent = data.title;
            if (contactDesc && data.description) contactDesc.textContent = data.description;
            if (emailLink && data.email) {
                emailLink.href = `mailto:${data.email}?subject=Hello Krishnanunni - Let's Connect!&body=Hi Krishnanunni,%0D%0A%0D%0AI came across your portfolio and would like to discuss...`;
                emailLink.textContent = data.email;
            }
            if (githubLink && data.github) {
                githubLink.href = data.github;
                githubLink.textContent = data.github.replace('https://', '');
            }
            if (linkedinLink && data.linkedin) {
                linkedinLink.href = data.linkedin;
                linkedinLink.textContent = data.linkedin.replace('https://', '');
            }
        } catch (error) {
            console.warn('Failed to load contact content:', error);
        }
    }

    async loadSkills() {
        try {
            const skillFiles = [
                'frontend-development',
                'backend-development', 
                'magento-development',
                'full-stack-solutions'
            ];
            
            const skills = [];
            for (const filename of skillFiles) {
                try {
                    const response = await fetch(`/content/skills/${filename}.md`);
                    if (response.ok) {
                        const content = await response.text();
                        const data = this.parseFrontMatter(content);
                        skills.push(data);
                    }
                } catch (error) {
                    console.warn(`Failed to load skill: ${filename}`, error);
                }
            }
            
            if (skills.length > 0) {
                skills.sort((a, b) => (a.order || 999) - (b.order || 999));
                this.renderSkills(skills);
            }
        } catch (error) {
            console.warn('Failed to load skills:', error);
        }
    }

    async loadProjects() {
        try {
            const projectFiles = [
                'ecommerce-platform',
                'hospital-management-system',
                'laravel-web-application'
            ];
            
            const projects = [];
            for (const filename of projectFiles) {
                try {
                    const response = await fetch(`/content/projects/${filename}.md`);
                    if (response.ok) {
                        const content = await response.text();
                        const data = this.parseFrontMatter(content);
                        projects.push(data);
                    }
                } catch (error) {
                    console.warn(`Failed to load project: ${filename}`, error);
                }
            }
            
            if (projects.length > 0) {
                projects.sort((a, b) => (a.order || 999) - (b.order || 999));
                this.renderProjects(projects);
            }
        } catch (error) {
            console.warn('Failed to load projects:', error);
        }
    }

    renderSkills(skills) {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;
        
        skillsGrid.innerHTML = skills.map(skill => `
            <div class="skill-card">
                <div class="skill-icon">
                    <i class="${skill.icon || 'fas fa-code'}"></i>
                </div>
                <h3 class="skill-title">${skill.title || 'Skill'}</h3>
                <p class="skill-description">${skill.description || ''}</p>
            </div>
        `).join('');
    }

    renderProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <i class="${project.icon || 'fas fa-project-diagram'}"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title || 'Project'}</h3>
                    <p class="project-description">${project.description || ''}</p>
                    <div class="project-tech">
                        ${(project.technologies || []).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    <div class="project-links">
                        ${project.live_url ? 
                            `<a href="${project.live_url}" class="project-link primary-link" target="_blank">View Live</a>` : 
                            `<a href="#" class="project-link primary-link">View Details</a>`
                        }
                        ${project.github_url ? 
                            `<a href="${project.github_url}" class="project-link secondary-link" target="_blank">GitHub</a>` : 
                            `<a href="https://github.com/krishnan7027" class="project-link secondary-link" target="_blank">GitHub</a>`
                        }
                    </div>
                </div>
            </div>
        `).join('');
    }

    parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontMatterRegex);
        
        if (!match) return {};
        
        const frontMatter = match[1];
        const data = {};
        
        // Simple YAML parser for front matter
        const lines = frontMatter.split('\n');
        let currentKey = null;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            if (trimmedLine.startsWith('- ')) {
                // Array item
                if (currentKey && Array.isArray(data[currentKey])) {
                    data[currentKey].push(trimmedLine.substring(2).replace(/"/g, ''));
                }
            } else if (trimmedLine.includes(':')) {
                // Key-value pair
                const colonIndex = trimmedLine.indexOf(':');
                const key = trimmedLine.substring(0, colonIndex).trim();
                let value = trimmedLine.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Check if this might be an array
                if (value === '' && lines[lines.indexOf(line) + 1]?.trim().startsWith('- ')) {
                    data[key] = [];
                    currentKey = key;
                } else {
                    data[key] = value;
                    currentKey = null;
                }
            }
        }
        
        return data;
    }
}

// Initialize CMS loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CMSLoader();
});
