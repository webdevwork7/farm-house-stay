export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  date?: string;
}

export const GUEST_REVIEWS: Review[] = [
  {
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "Absolutely wonderful experience! The farm house is beautiful and the hosts are incredibly welcoming. Our kids loved the spacious rooms and we enjoyed the peaceful surroundings every morning.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2 weeks ago",
  },
  {
    name: "Rajesh Kumar",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "Perfect getaway from city life. The farm house exceeded all expectations with its modern amenities and rustic charm. Highly recommend for families looking for a peaceful retreat.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 month ago",
  },
  {
    name: "Sarah Johnson",
    location: "Bangalore, Karnataka",
    rating: 5,
    text: "The most peaceful and rejuvenating vacation we've ever had. The farm house activities were amazing and the property was incredibly well-maintained and comfortable.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "3 weeks ago",
  },
  {
    name: "Amit Patel",
    location: "Pune, Maharashtra",
    rating: 5,
    text: "Exceeded all expectations! The farm house was exactly as described and the booking process was seamless. The property offers perfect blend of luxury and nature. Will definitely return.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2 months ago",
  },
  {
    name: "Kavya Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    text: "Amazing farm house with all modern facilities! The property is well-maintained, spacious, and perfect for large groups. The outdoor areas are fantastic for relaxation.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 week ago",
  },
  {
    name: "Vikram Singh",
    location: "Delhi, NCR",
    rating: 5,
    text: "Fantastic farm house experience! The property has excellent amenities, beautiful gardens, and a very peaceful environment. Perfect for weekend getaways with family.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "3 days ago",
  },
  {
    name: "Meera Joshi",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "Wonderful farm house with top-notch facilities. The property is clean, spacious, and has everything needed for a comfortable stay. Highly recommended for corporate retreats too.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "5 days ago",
  },
  {
    name: "Arjun Nair",
    location: "Kochi, Kerala",
    rating: 5,
    text: "Outstanding farm house property! Great location, excellent amenities, and very responsive hosts. The property is perfect for celebrations and family gatherings.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 month ago",
  },
  {
    name: "Deepika Agarwal",
    location: "Jaipur, Rajasthan",
    rating: 5,
    text: "Incredible farm house experience! The property has beautiful architecture, modern amenities, and peaceful surroundings. Perfect escape from busy city life.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2 weeks ago",
  },
  {
    name: "Rohit Gupta",
    location: "Lucknow, Uttar Pradesh",
    rating: 5,
    text: "Excellent farm house with all luxury amenities! The property is well-designed, spacious, and offers great value for money. Perfect for weekend trips with friends.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "4 days ago",
  },
  {
    name: "Anita Desai",
    location: "Surat, Gujarat",
    rating: 5,
    text: "Beautiful farm house property with excellent facilities. The hosts are very accommodating and the property is maintained to high standards. Great for family vacations.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 week ago",
  },
  {
    name: "Karthik Iyer",
    location: "Coimbatore, Tamil Nadu",
    rating: 5,
    text: "Superb farm house with modern amenities and beautiful surroundings. The property offers great privacy and is perfect for relaxation. Highly recommend for couples and families.",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "6 days ago",
  },
  {
    name: "Pooja Malhotra",
    location: "Chandigarh, Punjab",
    rating: 5,
    text: "Amazing farm house experience! The property has excellent infrastructure, beautiful gardens, and very peaceful environment. Perfect for special occasions and celebrations.",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "10 days ago",
  },
  {
    name: "Suresh Babu",
    location: "Visakhapatnam, Andhra Pradesh",
    rating: 5,
    text: "Fantastic farm house with all modern conveniences! The property is spacious, clean, and has excellent outdoor areas. Great for team outings and family reunions.",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2 weeks ago",
  },
  {
    name: "Nisha Kapoor",
    location: "Indore, Madhya Pradesh",
    rating: 5,
    text: "Wonderful farm house property with top-class amenities. The location is perfect, property is well-maintained, and offers great value. Excellent for weekend getaways.",
    avatar:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "3 weeks ago",
  },
  {
    name: "Ravi Teja",
    location: "Vijayawada, Andhra Pradesh",
    rating: 5,
    text: "Outstanding farm house with luxury facilities! The property has beautiful interiors, spacious rooms, and excellent outdoor spaces. Perfect for large group stays.",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 month ago",
  },
  {
    name: "Shreya Ghosh",
    location: "Kolkata, West Bengal",
    rating: 5,
    text: "Excellent farm house experience! The property combines modern luxury with natural beauty. Great amenities, peaceful location, and very responsive property management.",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "5 days ago",
  },
  {
    name: "Manoj Kumar",
    location: "Bhopal, Madhya Pradesh",
    rating: 5,
    text: "Superb farm house with all premium amenities! The property is beautifully designed, well-maintained, and offers great privacy. Perfect for special celebrations.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "8 days ago",
  },
  {
    name: "Divya Krishnan",
    location: "Thiruvananthapuram, Kerala",
    rating: 5,
    text: "Amazing farm house property with excellent facilities! The location is serene, property is spacious, and has all modern conveniences. Highly recommended for family trips.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "12 days ago",
  },
  {
    name: "Ashwin Patel",
    location: "Vadodara, Gujarat",
    rating: 5,
    text: "Incredible farm house with luxury amenities and beautiful surroundings! The property offers great comfort, excellent service, and perfect ambiance for relaxation.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "2 months ago",
  },
  {
    name: "Preethi Rao",
    location: "Mangalore, Karnataka",
    rating: 5,
    text: "Wonderful farm house experience! The property has excellent infrastructure, beautiful gardens, and very peaceful environment. Great for corporate events and family functions.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "1 week ago",
  },
  {
    name: "Harish Sharma",
    location: "Jodhpur, Rajasthan",
    rating: 5,
    text: "Fantastic farm house with all modern facilities! The property is well-designed, spacious, and has excellent outdoor areas. Perfect for weekend retreats with family and friends.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "9 days ago",
  },
  {
    name: "Lakshmi Menon",
    location: "Ernakulam, Kerala",
    rating: 5,
    text: "Excellent farm house property with top-notch amenities! The location is perfect, property is clean and spacious, and offers great value for money. Highly recommended.",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "15 days ago",
  },
  {
    name: "Sanjay Verma",
    location: "Kanpur, Uttar Pradesh",
    rating: 5,
    text: "Outstanding farm house with luxury facilities and beautiful architecture! The property provides excellent comfort, great amenities, and perfect setting for celebrations.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "3 weeks ago",
  },
  {
    name: "Rekha Pillai",
    location: "Thrissur, Kerala",
    rating: 5,
    text: "Amazing farm house experience with all premium amenities! The property is beautifully maintained, offers great privacy, and has excellent facilities for large groups.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    date: "4 weeks ago",
  },
];

export function getRandomReviews(count: number = 2): Review[] {
  const shuffled = [...GUEST_REVIEWS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
