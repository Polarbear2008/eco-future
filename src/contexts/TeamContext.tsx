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

// Helper function to get image paths
const getImagePath = (name: string): string => {
  // Map of team member names to their exact image filenames
  const imageMap: Record<string, string> = {
    "Abdugʻafurova Asal Shuxratjonovna": "Abdugʻafurova Asal Shuxratjonovna.jpg",
    "Alibek Toshmuratov Abdisattor oʻgʻli": "Alibek Toshmuratov Abdisattor oʻgʻli.JPG",
    "Asemay Asemova Maksudjanovna": "Asemay Asemova Maksudjanovna.jpg",
    "Ashurov Javohir": "Ashurov Javohir.JPG",
    "Ashurova Durdona": "Ashurova Durdona.JPG",
    "Barotova Shaxrizoda Yòldosh qizi": "Barotova Shaxrizoda  Yòldosh qizi.jpg",
    "Bobonazarova Binafsha Behzodovna": "Bobonazarova Binafsha Behzodovna.jpg",
    "Bobumaratov Sardorbek Shuxrat o'g'li": "Bobumaratov Sardorbek Shuxrat o'g'li.jpg",
    "Boburbek Panjiev Boboyorovich": "Boburbek Panjiev Boboyorovich.JPG",
    "Boynazarova Shukrona Sheraliyevna": "Boynazarova Shukrona Sheraliyevna.jpg",
    "Charos Mamayusupova Barot qizi": "Charos Mamayusupova Barot qizi.jpg",
    "Choriyev Said Akhtam Sanjar o'g'li": "Choriyev Said Akhtam Sanjar o'g'li.JPG",
    "Choriyeva Hurzoda Sanjar qizi": "Choriyeva Hurzoda Sanjar qizi.jpg",
    "Eldorbek Safarov Muzaffarovich": "Eldorbek Safarov Muzaffarovich.jpg",
    "Eshmamatov Asilbek Oybek oʻgʻli": "Eshmamatov Asilbek Oybek oʻgʻli.JPG",
    "Eshmoʻminova Mushtariy Otabek qizi": "Eshmoʻminova Mushtariy Otabek qizi.jpg",
    "Farhodova Fozila Uygunovna": "Farhodova Fozila Uygunovna.jpg",
    "Farxodova Sora Uyg'unovna": "Farxodova Sora Uyg'unovna.jpg",
    "Fayzullayev Ramziddin Demir o'g'li": "Fayzullayev Ramziddin Demir o'g'li.jpg",
    "Firdavs Xudoyberdiyev Suxrob o'g'li": "Firdavs Xudoyberdiyev Suxrob o'g'li.jpg",
    "Gulboyev Muhammadali Sultonbek òĝli": "Gulboyev Muhammadali Sultonbek òĝli.JPG",
    "Islamov Alisher Yusupovich": "Islamov Alisher Yusupovich.JPG",
    "Jo'rayev Dilnur Jasurovich": "Jo'rayev Dilnur Jasurovich.JPG",
    "Jumayev Zuhriddin Ikromjon o'g'li": "Jumayev Zuhriddin Ikromjon o'g'li.jpg",
    "Khurramov Asliddin Sharofutdin o'g'li": "Khurramov Asliddin.JPG",
    "Ko'charov Muhammad Ziyodulla oʻgʻli": "Ko'charov Muhammad Ziyodulla oʻgʻli.jpg",
    "Madiev Sardor Kenja o'g'li": "Madiev Sardor Kenja o'g'li.JPG",
    "Murotov Manuchekhr Sulaymonkulovich": "Murotov Manuchekhr Sulaymonkulovich.JPG",
    "Numonov Samandar Olimjon o'g'li": "Numonov Samandar Olimjon o'g'li.jpg",
    "Nurbek Salomov Choriyevich": "Nurbek Salomov Choriyevich.jpg",
    "Rizvonbek Hamroqulov Firo'z o'g'li": "Rizvonbek Hamroqulov Firo'z o'g'li.png",
    "Ro'ziyev Mirsaid Baxtiyor o'g'li": "Ro'ziyev Mirsaid Baxtiyor o'g'li.jpg",
    "Shohruh Tojiboyev Xoliyorovich": "Shohruh Tojiboyev Xoliyorovich.png",
    "Tojinorova Sitora Muhammadi qizi": "Tojinorova Sitora Muhammadi qizi.jpg",
    "Toshtemirova Muxlisa Akmal qizi": "Toshtemirova Muxlisa Akmal qizi.jpeg",
    "To`rayev Sanjarbek  Musayevich": "To`rayev Sanjarbek  Musayevich.jpg",
    "Usmonbek Abdukhalimov Eshberdiyevich": "Usmonbek Abdukhalimov Eshberdiyevich.jpg",
    "Xayrullayeva Feruza Faxrullayevna": "Xayrullayeva Feruza Faxrullayevna.JPG",
    "Xo'janov Asliddin Muzaffarovich": "Xo'janov Asliddin Muzaffarovich.jpg",
    "Xo'janov Shohjahon Muzaffarovich": "Xo'janov Shohjahon Muzaffarovich.JPG",
    "Ergashev Sardor": "Ergashev Sardor Azizjon o'g'li.JPG",
    "Qahramon": "logo.png",
    "Kholiyarov Javohir": "Ashurov Javohir.JPG" // Using similar image as fallback
  };

  // Normalize the name by trimming
  const normalizedName = name.trim();
  
  // Get the base URL of the current server
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Check if we have a direct mapping for this name
  if (imageMap[normalizedName]) {
    const imagePath = imageMap[normalizedName];
    
    // If it's the logo, return the direct path to the logo
    if (imagePath === "logo.png") {
      return `${baseUrl}/logo.png`;
    }
    
    // Return the full path to the team member image
    return `${baseUrl}/images/team/${imagePath}`;
  }
  
  // Return default logo for members without photos
  return `${baseUrl}/logo.png`;
};

// Create a function to display all images from the team directory
const getAllTeamImages = () => {
  // Create additional team members for any images not already assigned
  const additionalMembers: TeamMember[] = [];
  let nextId = defaultTeamMembers.length + 1;
  
  // Check all available images and add any that aren't already assigned to a team member
  const availableImages = [
    "Abdugʻafurova Asal Shuxratjonovna",
    "Alibek Toshmuratov Abdisattor oʻgʻli",
    "Asemay Asemova Maksudjanovna",
    "Ashurov Javohir",
    "Ashurova Durdona",
    "Barotova Shaxrizoda  Yòldosh qizi",
    "Bobonazarova Binafsha Behzodovna",
    "Bobumaratov Sardorbek Shuxrat o'g'li",
    "Boburbek Panjiev Boboyorovich",
    "Boynazarova Shukrona Sheraliyevna",
    "Charos Mamayusupova Barot qizi",
    "Choriyev Said Akhtam Sanjar o'g'li",
    "Choriyeva Hurzoda Sanjar qizi",
    "Eldorbek Safarov Muzaffarovich",
    "Eshmamatov Asilbek Oybek oʻgʻli",
    "Eshmoʻminova Mushtariy Otabek qizi",
    "Farhodova Fozila Uygunovna",
    "Farxodova Sora Uyg'unovna",
    "Fayzullayev Ramziddin Demir o'g'li",
    "Firdavs Xudoyberdiyev Suxrob o'g'li",
    "Gulboyev Muhammadali Sultonbek òĝli",
    "Islamov Alisher Yusupovich",
    "Jo'rayev Dilnur Jasurovich",
    "Jumayev Zuhriddin Ikromjon o'g'li",
    "Khurramov Asliddin",
    "Ko'charov Muhammad Ziyodulla oʻgʻli",
    "Madiev Sardor Kenja o'g'li",
    "Murotov Manuchekhr Sulaymonkulovich",
    "Numonov Samandar Olimjon o'g'li",
    "Nurbek Salomov Choriyevich",
    "Rizvonbek Hamroqulov Firo'z o'g'li",
    "Ro'ziyev Mirsaid Baxtiyor o'g'li",
    "Shohruh Tojiboyev Xoliyorovich",
    "Tojinorova Sitora Muhammadi qizi",
    "Toshtemirova Muxlisa Akmal qizi",
    "To`rayev Sanjarbek  Musayevich",
    "Usmonbek Abdukhalimov Eshberdiyevich",
    "Xayrullayeva Feruza Faxrullayevna",
    "Xo'janov Asliddin Muzaffarovich",
    "Xo'janov Shohjahon Muzaffarovich"
  ];
  
  availableImages.forEach(imageName => {
    // Skip if this image is already assigned to a team member
    const isAssigned = defaultTeamMembers.some(member => 
      member.name.toLowerCase().includes(imageName.toLowerCase()) || 
      imageName.toLowerCase().includes(member.name.toLowerCase())
    );
    
    if (!isAssigned) {
      additionalMembers.push({
        id: nextId++,
        name: imageName,
        role: "Team Member",
        bio: `${imageName} contributes to our environmental initiatives.`,
        image: getImagePath(imageName),
        category: "Team Members"
      });
    }
  });
  
  // Return combined list of default members plus any additional members from images
  return [...defaultTeamMembers, ...additionalMembers];
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
    role: "Co-Founder",
    bio: "Fozila is one of the founding members of EcoFuture.",
    image: getImagePath("Farhodova Fozila Uygunovna"),
    category: "Founders"
  },
  
  // Logistics Coordinators
  {
    id: 3,
    name: "Xo'janov Shohjahon Muzaffarovich",
    role: "Head of Logistics Coordinators",
    bio: "Shohjahon coordinates logistics for our environmental projects.",
    image: getImagePath("Xo'janov Shohjahon Muzaffarovich"),
    category: "Logistics Coordinators"
  },
  {
    id: 4,
    name: "Jumayev Zuhriddin Ikromjon o'g'li",
    role: "Head of Logistics Coordinators",
    bio: "Zuhriddin coordinates logistics for our environmental projects.",
    image: getImagePath("Jumayev Zuhriddin Ikromjon o'g'li"),
    category: "Logistics Coordinators"
  },
  {
    id: 5,
    name: "Xayrullayeva Feruza Faxrullayevna",
    role: "Logistics Coordinator",
    bio: "Feruza manages logistics for our conservation initiatives.",
    image: getImagePath("Xayrullayeva Feruza Faxrullayevna"),
    category: "Logistics Coordinators"
  },
  {
    id: 6,
    name: "Kholiyarov Javohir",
    role: "Logistics Coordinator",
    bio: "Javohir handles logistics for our environmental programs.",
    image: getImagePath("Kholiyarov Javohir"), // Using similar image as fallback
    category: "Logistics Coordinators"
  },
  {
    id: 7,
    name: "Eshmoʻminova Mushtariy Otabek qizi",
    role: "Logistics Coordinator",
    bio: "Mushtariy handles logistics for our environmental programs.",
    image: getImagePath("Eshmoʻminova Mushtariy Otabek qizi"),
    category: "Logistics Coordinators"
  },
  {
    id: 8,
    name: "Roʻziyev Mirsaid Baxtiyor oʻgʻli",
    role: "Logistics Coordinator",
    bio: "Mirsaid manages logistics for our conservation initiatives.",
    image: getImagePath("Ro'ziyev Mirsaid Baxtiyor o'g'li"),
    category: "Logistics Coordinators"
  },
  {
    id: 9,
    name: "Farhodova Sora Uygunovna",
    role: "Logistics Coordinator",
    bio: "Sora handles logistics for our environmental programs.",
    image: getImagePath("Farxodova Sora Uyg'unovna"),
    category: "Logistics Coordinators"
  },
  {
    id: 10,
    name: "Choriyeva Hurzoda Sanjar qizi",
    role: "Logistics Coordinator",
    bio: "Hurzoda manages logistics for our conservation initiatives.",
    image: getImagePath("Choriyeva Hurzoda Sanjar qizi"),
    category: "Logistics Coordinators"
  },
  
  // Finance Managers
  {
    id: 11,
    name: "Bobomuratov Sardor Shuxrat o'g'li",
    role: "Head of Finance Manager",
    bio: "Sardor manages the financial aspects of our organization.",
    image: getImagePath("Bobumaratov Sardorbek Shuxrat o'g'li"),
    category: "Finance Managers"
  },
  {
    id: 12,
    name: "Torayev Sanjarbek Musayevich",
    role: "Finance Manager",
    bio: "Sanjarbek oversees our financial planning and budgeting.",
    image: getImagePath("To`rayev Sanjarbek  Musayevich"),
    category: "Finance Managers"
  },
  {
    id: 13,
    name: "Asemay Asemova Maksudjanovna",
    role: "Finance Manager",
    bio: "Asemay oversees our financial planning and budgeting.",
    image: getImagePath("Asemay Asemova Maksudjanovna"),
    category: "Finance Managers"
  },
  
  // Designers
  {
    id: 14,
    name: "Numonov Samandar Olimjon o'g'li",
    role: "Head of Designers",
    bio: "Samandar leads the design team for our environmental projects.",
    image: getImagePath("Numonov Samandar Olimjon o'g'li"),
    category: "Designers"
  },
  {
    id: 15,
    name: "Fayzullayev Ramziddin Demir oʻgʻli",
    role: "Designer",
    bio: "Ramziddin creates visual designs for our campaigns and materials.",
    image: getImagePath("Fayzullayev Ramziddin Demir o'g'li"),
    category: "Designers"
  },
  {
    id: 16,
    name: "Islamov Alisher Yusupovich",
    role: "Designer",
    bio: "Alisher designs visual content for our environmental initiatives.",
    image: getImagePath("Islamov Alisher Yusupovich"),
    category: "Designers"
  },
  {
    id: 17,
    name: "Shohruh Tojiboyev Xoliyorovich",
    role: "Designer",
    bio: "Shohruh designs visual content for our environmental initiatives.",
    image: getImagePath("Shohruh Tojiboyev Xoliyorovich"),
    category: "Designers"
  },
  {
    id: 18,
    name: "Usmonbek Abdukhalimov Eshberdiyevich",
    role: "Designer",
    bio: "Usmonbek designs visual content for our environmental campaigns.",
    image: getImagePath("Usmonbek Abdukhalimov Eshberdiyevich"),
    category: "Designers"
  },
  {
    id: 19,
    name: "Firdavs Xudoyberdiyev Suxrob oʻgʻli",
    role: "Designer",
    bio: "Firdavs creates designs for our conservation awareness materials.",
    image: getImagePath("Firdavs Xudoyberdiyev Suxrob o'g'li"),
    category: "Designers"
  },
  {
    id: 20,
    name: "Ko'charov Muhammad Ziyodulla oʻgʻli",
    role: "Designer",
    bio: "Muhammad designs visual content for our environmental initiatives.",
    image: getImagePath("Ko'charov Muhammad Ziyodulla oʻgʻli"),
    category: "Designers"
  },
  
  // Content Makers
  {
    id: 21,
    name: "Rizvonbek Hamroqulov Firoʻz oʻgʻli",
    role: "Head of Content Maker",
    bio: "Rizvonbek leads the content creation for our conservation initiatives.",
    image: getImagePath("Rizvonbek Hamroqulov Firo'z o'g'li"),
    category: "Content Makers"
  },
  {
    id: 22,
    name: "Qahramon",
    role: "Content Maker",
    bio: "Qahramon creates content for our environmental awareness campaigns.",
    image: getImagePath("Qahramon"), // Using default logo
    category: "Content Makers"
  },
  {
    id: 23,
    name: "Ergashev Sardor",
    role: "Content Maker",
    bio: "Sardor creates content for our environmental awareness campaigns.",
    image: getImagePath("Ergashev Sardor"),
    category: "Content Makers"
  },
  {
    id: 24,
    name: "Murotov Manuchekhr Sulaymonkulovich",
    role: "Content Maker",
    bio: "Manuchekhr produces content for our conservation awareness campaigns.",
    image: getImagePath("Murotov Manuchekhr Sulaymonkulovich"),
    category: "Content Makers"
  },
  {
    id: 25,
    name: "Charos Mamayusupova Barot qizi",
    role: "Content Maker",
    bio: "Charos creates content for our environmental initiatives.",
    image: getImagePath("Charos Mamayusupova Barot qizi"),
    category: "Content Makers"
  },
  {
    id: 26,
    name: "Nurbek Salomov Choriyevich",
    role: "Content Maker",
    bio: "Nurbek produces content for our conservation programs.",
    image: getImagePath("Nurbek Salomov Choriyevich"),
    category: "Content Makers"
  },
  
  // Administration & Special Roles
  {
    id: 27,
    name: "Alibek Toshmuratov Abdisattor oʻgʻli",
    role: "Admin",
    bio: "Alibek manages administrative functions for our organization.",
    image: getImagePath("Alibek Toshmuratov Abdisattor oʻgʻli"),
    category: "Administration & Special Roles"
  },
  {
    id: 28,
    name: "Khurramov Asliddin Sharofutdin o'g'li",
    role: "Head of Mobilographs",
    bio: "Asliddin leads the mobile photography team for our environmental projects.",
    image: getImagePath("Khurramov Asliddin Sharofutdin o'g'li"),
    category: "Administration & Special Roles"
  },
  {
    id: 29,
    name: "Boburbek Panjiev Boboyorovich",
    role: "Mobilograph",
    bio: "Boburbek handles mobile photography for our environmental projects.",
    image: getImagePath("Boburbek Panjiev Boboyorovich"),
    category: "Administration & Special Roles"
  },
  
  // Volunteers
  {
    id: 30,
    name: "Barotova Shaxrizoda Yòldosh qizi",
    role: "Head of Volunteers",
    bio: "Shaxrizoda leads and coordinates our volunteer programs.",
    image: getImagePath("Barotova Shaxrizoda  Yòldosh qizi"),
    category: "Volunteers"
  },
  {
    id: 31,
    name: "Eshmamatov Asilbek Oybek oʻgʻli",
    role: "Volunteer",
    bio: "Asilbek volunteers for our environmental conservation initiatives.",
    image: getImagePath("Eshmamatov Asilbek Oybek oʻgʻli"),
    category: "Volunteers"
  },
  {
    id: 32,
    name: "Ashurov Javohir",
    role: "Volunteer",
    bio: "Javohir volunteers for our conservation programs.",
    image: getImagePath("Ashurov Javohir"),
    category: "Volunteers"
  },
  {
    id: 33,
    name: "Joʻrayev Dilnur Jasurovich",
    role: "Volunteer",
    bio: "Dilnur volunteers for our environmental initiatives.",
    image: getImagePath("Jo'rayev Dilnur Jasurovich"),
    category: "Volunteers"
  },
  {
    id: 34,
    name: "Abdugʻafurova Asal Shuxratjonovna",
    role: "Volunteer",
    bio: "Asal volunteers for our conservation awareness campaigns.",
    image: getImagePath("Abdugʻafurova Asal Shuxratjonovna"),
    category: "Volunteers"
  },
  {
    id: 35,
    name: "Tojinorova Sitora Muhammadi qizi",
    role: "Volunteer",
    bio: "Sitora volunteers for our environmental programs.",
    image: getImagePath("Tojinorova Sitora Muhammadi qizi"),
    category: "Volunteers"
  },
  {
    id: 36,
    name: "Bobonazarova Binafsha Behzodovna",
    role: "Volunteer",
    bio: "Binafsha volunteers for our conservation initiatives.",
    image: getImagePath("Bobonazarova Binafsha Behzodovna"),
    category: "Volunteers"
  },
  {
    id: 37,
    name: "Choriyev Said Akhtam Sanjar o'g'li",
    role: "Volunteer",
    bio: "Said volunteers for our environmental programs.",
    image: getImagePath("Choriyev Said Akhtam Sanjar o'g'li"),
    category: "Volunteers"
  },
  {
    id: 38,
    name: "Boynazarova Shukrona Sheraliyevna",
    role: "Volunteer",
    bio: "Shukrona volunteers for our environmental conservation initiatives.",
    image: getImagePath("Boynazarova Shukrona Sheraliyevna"),
    category: "Volunteers"
  },
  {
    id: 39,
    name: "Gulboyev Muhammadali Sultonbek oʻgʻli",
    role: "Volunteer",
    bio: "Muhammadali volunteers for our environmental initiatives.",
    image: getImagePath("Gulboyev Muhammadali Sultonbek òĝli"),
    category: "Volunteers"
  },
  {
    id: 40,
    name: "Xo'janov Asliddin Muzaffarovich",
    role: "Volunteer",
    bio: "Asliddin volunteers for our conservation programs.",
    image: getImagePath("Xo'janov Asliddin Muzaffarovich"),
    category: "Volunteers"
  },
  {
    id: 41,
    name: "Eldorbek Safarov Muzaffarovich",
    role: "Volunteer",
    bio: "Eldorbek volunteers for our environmental initiatives.",
    image: getImagePath("Eldorbek Safarov Muzaffarovich"),
    category: "Volunteers"
  },
  {
    id: 42,
    name: "Toshtemirova Muxlisa Akmal qizi",
    role: "Volunteer",
    bio: "Muxlisa volunteers for our conservation awareness campaigns.",
    image: getImagePath("Toshtemirova Muxlisa Akmal qizi"),
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
    // Simulate loading from an API or database
    const loadTeamMembers = () => {
      setIsLoading(true);
      
      // Get all team members including any from unassigned images
      const allTeamMembers = getAllTeamImages();
      
      // Check local storage for any saved updates
      const savedTeam = localStorage.getItem('teamMembers');
      if (savedTeam) {
        try {
          const parsedTeam = JSON.parse(savedTeam);
          setTeamMembers(parsedTeam);
        } catch (error) {
          console.error('Error parsing saved team data:', error);
          setTeamMembers(allTeamMembers);
        }
      } else {
        setTeamMembers(allTeamMembers);
      }
      
      setIsLoading(false);
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
