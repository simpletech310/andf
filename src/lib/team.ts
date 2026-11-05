/**
 * A New Day Foundation leadership. Names, titles, and bios follow the official
 * board page (anewdayfoundation.net/?page_id=4074), lightly edited for style.
 */
export type TeamMember = { name: string; title: string; image: string; bio?: string[] };

export const BOARD_AND_ADVISORS: TeamMember[] = [
  {
    name: "Dawnn Lewis",
    title: "Founder & President",
    image: "/images/team/dawnn-lewis.jpg",
    bio: [
      "Dawnn Lewis is a multi-talented and multifaceted individual: a Grammy Award-winning singer, a multiple ASCAP and BMI Award-winning songwriter, a film, TV, and stage actor, composer, and series TV creator and producer. She is also President of Morning Jewel Inc.",
      "Her commitment to the community includes service on several boards and as a spokesperson for a variety of organizations: the National Advisory Board of the National Center for Civil and Human Rights; the SAG and SAG-AFTRA National Board of Directors, where she participated in the successful merger while serving as National and Los Angeles Chair of the SAG (now SAG-AFTRA) Singers Committee; SAG Pension Trustee; the K.I.S. Foundation for Sickle Cell Disease; UNCF; the American Heart Association; the American Cancer Society; and the EMPOWHER Institute.",
      "Dawnn co-produced, with the Los Angeles Urban League, A NEW DAY: Concert for a Cause — \u201cThe Entertainment Family Gives Back\u201d — a concert event featuring 40 celebrity musicians, artists, and performers who donated their performances to raise awareness and financial support for community-based nonprofit organizations.",
    ],
  },
  {
    name: "Cheri Haft",
    title: "Treasurer",
    image: "/images/team/cheri-haft.jpg",
    bio: [
      "Cheri has provided accounting and business management services for more than 30 years. Her clients include nonprofit organizations, entertainment companies, and a range of other businesses, among them Kidpower.org, New Leash on Life: Animal Rescue Foundation, Rodeo Realty, The Haft Group, Platform International Animation Festival Entertainment, KMV Productions, Morning Jewel Inc., Method Animation, Steven Pines CPA, and Portmanteau Productions.",
      "Cheri is passionate about giving back to the community and providing exceptional service to all of her clients.",
    ],
  },
  {
    name: "Claire Padmore-Clarke",
    title: "Board Member",
    image: "/images/team/claire-padmore-clarke.jpg",
    bio: [
      "Claire Padmore-Clarke is an experienced professional at a leading beverage company, with deep expertise in leadership, compliance, and organizational change management. Known for resolving challenges and driving process improvements, she is committed to advancing inclusion through 21 years of Employee Resource Group leadership, championing \u201cA Space to Be YOU\u201d for all.",
      "Outside of work, Claire is involved in initiatives that support job preparedness and address food insecurity, and she serves on the boards of the YMCA of Anaheim and The K.I.S. Foundation. She believes in the power of education and small, meaningful actions to create lasting, positive impact.",
    ],
  },
  {
    name: "Scott McGregor",
    title: "Board Member",
    image: "/images/team/scott-mcgregor.jpg",
    bio: [
      "Scott McGregor is a 16-year Cisco veteran who, as Director of Cisco\u2019s Social Justice Action Office, leads the company\u2019s $150 million, five-year commitment to Historically Black Colleges and Universities and related rural broadband initiatives. He moved into the People, Policy & Purpose organization in 2020 and now drives sustainable, tech-powered solutions for digital and educational equity in underserved communities.",
      "Scott is passionate about lifting the burden of network and security maintenance from resource-strapped institutions so they can focus on their core missions. He actively seeks nonprofit and industry partners to deliver the infrastructure support and training that will put these communities on a path to long-term success.",
    ],
  },
  {
    name: "Deane Leavenworth",
    title: "Board Member",
    image: "/images/team/deane-leavenworth.jpg",
    bio: [
      "Deane Leavenworth is a Government Relations Consultant and Advisor. He has spent four decades connecting the public sector, private sector, and the educational and non-profit communities, resulting in public/private partnerships that benefit the communities these organizations serve.",
      "Deane began his career as a classroom teacher and established one of the first computer-assisted and computer-managed instructional labs on the West Coast, delivering daily, individualized instruction to students.",
      "In the public sector, he has served the City of Los Angeles as a senior official in the Office of the Mayor and City Council, and as a Los Angeles County Commissioner. In the private sector, Deane held executive positions at a major entertainment and technology company for two decades.",
      "Deane continues to provide leadership and guidance in his areas of passion: education and workforce development, the arts, civil rights, and corporate social responsibility and inclusivity.",
    ],
  },
  {
    name: "George Gibbs",
    title: "Advisory Board Member",
    image: "/images/team/george-gibbs.jpg",
    bio: [
      "George Gibbs is the retired Community Affairs Manager for UPS\u2019s West Region, an organization of 120,000 employees, where he oversaw community affairs and philanthropic strategy and was responsible for maintaining UPS\u2019s reputation as a good corporate citizen and employer of choice. He also oversaw the region\u2019s $19 million annual United Way employee giving campaign.",
      "His previous positions include UPS Northeast Texas District Employee Relations Manager, UPS Southwest Region Workforce Planning Manager, Learning & Development Manager, Comprehensive Health & Safety Program Manager, and UPS Pacific Region Employee Relations Manager.",
      "George has donated his time and expertise to the community by serving on several community and ecumenical boards, including The Greater Dallas Urban League, the National Urban League\u2019s Black Executive Exchange Program, and Bible Way Bible Church\u2019s Board of Elders. He currently serves as Chairman of the Los Angeles UNCF Leadership Council.",
    ],
  },
  {
    name: "Arnold Hackett",
    title: "Advisory Board Member",
    image: "/images/team/arnold-hackett.jpg",
    bio: [
      "Arnold Hackett is Senior Advisor to the Chief Executive Officer of the Los Angeles County Metropolitan Transportation Authority (LA Metro). He supports the digital transformation of LA Metro\u2019s major initiatives, bringing deep experience in financial strategy (including cost-benefit analysis), operations, and innovation, and helps ensure those initiatives are aligned with agency priorities, operationally sound, and efficiently executed.",
      "He provides leadership to strengthen internal coordination, streamline processes, and enhance oversight of complex projects and programs.",
      "Arnold is the former Vice President of Alliance and Partnership Management for Xerox, where he built an exemplary 28-year career. A seasoned and versatile executive, he has a successful track record of spearheading business services and technology advancements, formulating key efficiency strategies, leading teams to deliver significant results, and serving as an effective change agent who influences at every level of an organization.",
    ],
  },
  {
    name: "Adriane Lamar-Snider",
    title: "Advisory Board Member",
    image: "/images/team/adriane-lamar-snider.jpg",
    bio: [
      "Adriane Lamar-Snider is a passionate and dedicated advocate for women and girls who has worked to ensure that the concerns of Black women and girls are at the forefront of our political, social, and economic discourse.",
      "Adriane is currently the Executive Director of the Riverside Area Rape Crisis Center. She previously served 13 years as Chief Operations Officer at Jenesse Center and one year as Executive Director of the Violence Prevention Coalition.",
      "Having earned a Master of Science degree, she advances social justice and economic empowerment by working with organizations to ensure sound fiscal, programmatic, and administrative oversight. Her mission is to provide exceptional stewardship of program resources and see that those programs and organizations thrive.",
    ],
  },
];

export const TEAM: TeamMember[] = [
  { name: "Christy Zhou", title: "Programs", image: "/images/team/christy-zhou.jpg" },
  { name: "Sheila Gilmore", title: "Outreach", image: "/images/team/sheila-gilmore.jpg" },
];


/** Voting board (everyone whose title isn't "Advisory Board Member"). */
export const BOARD = BOARD_AND_ADVISORS.filter((m) => !m.title.startsWith("Advisory"));
/** Advisory board, listed separately on the official site. */
export const ADVISORY_BOARD = BOARD_AND_ADVISORS.filter((m) => m.title.startsWith("Advisory"));
