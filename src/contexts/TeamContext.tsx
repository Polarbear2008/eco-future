import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the team member interface
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: string; // Added category field for grouping
}

interface TeamContextType {
  teamMembers: TeamMember[];
  updateTeamMemberPhoto: (id: number, imageUrl: string) => void;
  isLoading: boolean;
}

// Helper function to encode image paths
const encodeImagePath = (path: string): string => {
  // Split the path to preserve the /images/team/ part
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  // Encode only the filename part
  const encodedFilename = encodeURIComponent(filename);
  // Reconstruct the path
  parts[parts.length - 1] = encodedFilename;
  return parts.join('/');
};

// Helper function to check if an image exists and return the appropriate path
const getImagePath = (name: string): string => {
  // List of available images (filenames without extension)
  const availableImages = [
    "Abdugʻafurova Asal Shuxratjonovna",
    "Alibek Toshmuratov Abdisattor oʻgʻli",
    "Ashurov Javohir",
    "Barotova Shaxrizoda",
    "Bobonazarova Binafsha Behzodovna",
    "Boynazarova Shukrona Sheraliyevna",
    "Charos Mamayusupova Barot qizi",
    "Eshmamatov Asilbek Oybek oʻgʻli",
    "Eshmoʻminova Mushtariy Otabek qizi",
    "Farhodova Fozila Uygunovna",
    "Fayzullayev Ramziddin Demir o'g'li",
    "Firdavs Xudoyberdiyev Suxrob o'g'li",
    "Gulboyev Muhammadali Sultonbek òĝli",
    "Jo'rayev Dilnur Jasurovich",
    "Madiev Sardor Kenja o'g'li",
    "Murotov Manuchekhr Sulaymonkulovich",
    "Nurbek Salomov Choriyevich",
    "Rizvonbek Hamroqulov Firo'z o'g'li",
    "Ro'ziyev Mirsaid Baxtiyor o'g'li",
    "Tojinorova Sitora Muhammadi qizi",
    "Xayrullayeva Feruza Faxrullayevna",
    "Xo'janov Shohjahon Muzaffarovich"
  ];

  // Check if the name is in the list of available images
  const nameWithoutExtension = name.trim();
  const hasImage = availableImages.some(img => 
    img.toLowerCase() === nameWithoutExtension.toLowerCase()
  );

  if (hasImage) {
    // Find the exact case-sensitive name from the available images
    const exactName = availableImages.find(img => 
      img.toLowerCase() === nameWithoutExtension.toLowerCase()
    );
    
    // Determine the extension (most are JPG but some are jpg or png)
    let extension = ".JPG";
    if (["Barotova Shaxrizoda", "Bobonazarova Binafsha Behzodovna", 
         "Boynazarova Shukrona Sheraliyevna", "Charos Mamayusupova Barot qizi",
         "Eshmoʻminova Mushtariy Otabek qizi", "Farhodova Fozila Uygunovna",
         "Fayzullayev Ramziddin Demir o'g'li", "Firdavs Xudoyberdiyev Suxrob o'g'li",
         "Nurbek Salomov Choriyevich", "Tojinorova Sitora Muhammadi qizi"].includes(exactName || "")) {
      extension = ".jpg";
    } else if (["Rizvonbek Hamroqulov Firo'z o'g'li"].includes(exactName || "")) {
      extension = ".png";
    }
    
    return encodeImagePath(`/images/team/${exactName}${extension}`);
  } else {
    // Return default logo for members without photos
    return "/logo.png";
  }
};

// Updated team members with direct paths to uploaded images, organized by categories
const defaultTeamMembers: TeamMember[] = [
  // Founders
  {
    id: 1,
    name: "Madiyev Sardor Kenja oʻgʻli",
    role: "Founder",
    bio: "Sardor is one of the founding members of EcoFuture.",
    image: getImagePath("Madiev Sardor Kenja o'g'li"),
    category: "Founders"
  },
  {
    id: 2,
    name: "Farhodova Fozila Uygunovna",
    role: "Founder",
    bio: "Fozila is one of the founding members of EcoFuture.",
    image: getImagePath("Farhodova Fozila Uygunovna"),
    category: "Founders"
  },
  
  // Logistics Coordinators
  {
    id: 3,
    name: "Xo'janov Shohjahon Muzaffarovich",
    role: "Logistics Coordinator",
    bio: "Shohjahon coordinates logistics for our environmental projects.",
    image: getImagePath("Xo'janov Shohjahon Muzaffarovich"),
    category: "Logistics Coordinators"
  },
  {
    id: 4,
    name: "Xayrullayeva Feruza Faxrullayevna",
    role: "Logistics Coordinator",
    bio: "Feruza manages logistics for our conservation initiatives.",
    image: getImagePath("Xayrullayeva Feruza Faxrullayevna"),
    category: "Logistics Coordinators"
  },
  {
    id: 5,
    name: "Eshmoʻminova Mushtariy Otabek qizi",
    role: "Logistics Coordinator",
    bio: "Mushtariy handles logistics for our environmental programs.",
    image: getImagePath("Eshmoʻminova Mushtariy Otabek qizi"),
    category: "Logistics Coordinators"
  },
  
  // Finance Managers
  {
    id: 6,
    name: "Sanjar",
    role: "Finance Manager",
    bio: "Sanjar manages the financial aspects of our organization.",
    image: getImagePath("Sanjar"),
    category: "Finance Managers"
  },
  {
    id: 7,
    name: "Asemay Asemova Maksudjanovna",
    role: "Finance Manager",
    bio: "Asemay oversees our financial planning and budgeting.",
    image: getImagePath("Asemay Asemova Maksudjanovna"),
    category: "Finance Managers"
  },
  
  // Designers
  {
    id: 8,
    name: "Fayzullayev Ramziddin Demir oʻgʻli",
    role: "Designer",
    bio: "Ramziddin creates visual designs for our campaigns and materials.",
    image: getImagePath("Fayzullayev Ramziddin Demir o'g'li"),
    category: "Designers"
  },
  {
    id: 9,
    name: "Shohruh Tojiboyev Xoliyorovich",
    role: "Designer",
    bio: "Shohruh designs visual content for our environmental initiatives.",
    image: getImagePath("Shohruh Tojiboyev Xoliyorovich"),
    category: "Designers"
  },
  {
    id: 10,
    name: "Numonov Samandar Olimjon o'g'li",
    role: "Designer",
    bio: "Samandar creates graphics and visual materials for our projects.",
    image: getImagePath("Numonov Samandar Olimjon o'g'li"),
    category: "Designers"
  },
  {
    id: 11,
    name: "Usmon",
    role: "Designer",
    bio: "Usmon designs visual content for our environmental campaigns.",
    image: getImagePath("Usmon"),
    category: "Designers"
  },
  {
    id: 12,
    name: "Firdavs Xudoyberdiyev Suxrob oʻgʻli",
    role: "Designer",
    bio: "Firdavs creates designs for our conservation awareness materials.",
    image: getImagePath("Firdavs Xudoyberdiyev Suxrob o'g'li"),
    category: "Designers"
  },
  {
    id: 13,
    name: "Gulboyev Muhammadali Sultonbek oʻgʻli",
    role: "Designer",
    bio: "Muhammadali designs visual content for our environmental initiatives.",
    image: getImagePath("Gulboyev Muhammadali Sultonbek òĝli"),
    category: "Designers"
  },
  
  // Content Makers
  {
    id: 14,
    name: "Qahramon",
    role: "Content Maker",
    bio: "Qahramon creates content for our environmental awareness campaigns.",
    image: getImagePath("Qahramon"),
    category: "Content Makers"
  },
  {
    id: 15,
    name: "Rizvonbek Hamroqulov Firoʻz oʻgʻli",
    role: "Content Maker",
    bio: "Rizvonbek produces content for our conservation initiatives.",
    image: getImagePath("Rizvonbek Hamroqulov Firo'z o'g'li"),
    category: "Content Makers"
  },
  {
    id: 16,
    name: "Roʻziyev Mirsaid Baxtiyor oʻgʻli",
    role: "Content Maker",
    bio: "Mirsaid creates content for our environmental programs.",
    image: getImagePath("Ro'ziyev Mirsaid Baxtiyor o'g'li"),
    category: "Content Makers"
  },
  {
    id: 17,
    name: "Murotov Manuchekhr Sulaymonkulovich",
    role: "Content Maker",
    bio: "Manuchekhr produces content for our conservation awareness campaigns.",
    image: getImagePath("Murotov Manuchekhr Sulaymonkulovich"),
    category: "Content Makers"
  },
  {
    id: 18,
    name: "Charos Mamayusupova Barot qizi",
    role: "Content Maker",
    bio: "Charos creates content for our environmental initiatives.",
    image: getImagePath("Charos Mamayusupova Barot qizi"),
    category: "Content Makers"
  },
  {
    id: 19,
    name: "Nurbek Salomov Choriyevich",
    role: "Content Maker",
    bio: "Nurbek produces content for our conservation programs.",
    image: getImagePath("Nurbek Salomov Choriyevich"),
    category: "Content Makers"
  },
  
  // Administration & Special Roles
  {
    id: 20,
    name: "Alibek Toshmuratov Abdisattor oʻgʻli",
    role: "Admin",
    bio: "Alibek manages administrative functions for our organization.",
    image: getImagePath("Alibek Toshmuratov Abdisattor oʻgʻli"),
    category: "Administration & Special Roles"
  },
  {
    id: 21,
    name: "Bobur",
    role: "Mobilograph",
    bio: "Bobur handles mobile photography for our environmental projects.",
    image: getImagePath("Bobur"),
    category: "Administration & Special Roles"
  },
  
  // Volunteers
  {
    id: 22,
    name: "Eshmamatov Asilbek Oybek oʻgʻli",
    role: "Volunteer",
    bio: "Asilbek volunteers for our environmental conservation initiatives.",
    image: getImagePath("Eshmamatov Asilbek Oybek oʻgʻli"),
    category: "Volunteers"
  },
  {
    id: 23,
    name: "Ashurov Javohir",
    role: "Volunteer",
    bio: "Javohir volunteers for our conservation programs.",
    image: getImagePath("Ashurov Javohir"),
    category: "Volunteers"
  },
  {
    id: 24,
    name: "Joʻrayev Dilnur Jasurovich",
    role: "Volunteer",
    bio: "Dilnur volunteers for our environmental initiatives.",
    image: getImagePath("Jo'rayev Dilnur Jasurovich"),
    category: "Volunteers"
  },
  {
    id: 25,
    name: "Abdugʻafurova Asal Shuxratjonovna",
    role: "Volunteer",
    bio: "Asal volunteers for our conservation awareness campaigns.",
    image: getImagePath("Abdugʻafurova Asal Shuxratjonovna"),
    category: "Volunteers"
  },
  {
    id: 26,
    name: "Tojinorova Sitora Muhammadi qizi",
    role: "Volunteer",
    bio: "Sitora volunteers for our environmental programs.",
    image: getImagePath("Tojinorova Sitora Muhammadi qizi"),
    category: "Volunteers"
  },
  {
    id: 27,
    name: "Bobonazarova Binafsha Behzodovna",
    role: "Volunteer",
    bio: "Binafsha volunteers for our conservation initiatives.",
    image: getImagePath("Bobonazarova Binafsha Behzodovna"),
    category: "Volunteers"
  },
  {
    id: 28,
    name: "Choriyev Said Akhtam Sanjar o'g'li",
    role: "Volunteer",
    bio: "Said volunteers for our environmental programs.",
    image: getImagePath("Choriyev Said Akhtam Sanjar o'g'li"),
    category: "Volunteers"
  },
  {
    id: 29,
    name: "Barotova Shaxrizoda Yòldosh qizi",
    role: "Head of Volunteers",
    bio: "Shaxrizoda leads and coordinates our volunteer programs.",
    image: getImagePath("Barotova Shaxrizoda"),
    category: "Volunteers"
  },
  {
    id: 30,
    name: "Boynazarova Shukrona Sheraliyevna",
    role: "Volunteer",
    bio: "Shukrona volunteers for our environmental conservation initiatives.",
    image: getImagePath("Boynazarova Shukrona Sheraliyevna"),
    category: "Volunteers"
  }
];

// Create the context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Provider component
export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load team members from localStorage or use default
    const loadTeamMembers = () => {
      try {
        const savedTeamMembers = localStorage.getItem('teamMembers');
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        } else {
          setTeamMembers(defaultTeamMembers);
          localStorage.setItem('teamMembers', JSON.stringify(defaultTeamMembers));
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        setTeamMembers(defaultTeamMembers);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  // Update team member photo
  const updateTeamMemberPhoto = (id: number, imageUrl: string) => {
    setTeamMembers(prevMembers => {
      const updatedMembers = prevMembers.map(member => 
        member.id === id ? { ...member, image: imageUrl } : member
      );
      
      // Save to localStorage
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      return updatedMembers;
    });
  };

  return (
    <TeamContext.Provider value={{ teamMembers, updateTeamMemberPhoto, isLoading }}>
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook to use the team context
export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
