import { Flex, Text, Box } from "@chakra-ui/react";
import { HamburgerIcon} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import "./Navbar.css";

const Navbar = () => {
  const [isSchoolHovered, setIsSchoolHovered] = useState(false);
  const [isCampusHovered, setIsCampusHovered] = useState(false);
  const [isCurriculumHovered, setIsCurriculumHovered] = useState(false);

  const [isMobileResponsive, setIsMobileResponsive] = useState(
    window.innerWidth < 800 ? true : false
  );
  const [isToggled, setIsToggled] = useState(
    window.innerWidth < 800 ? true : false
  );
 console.log(isToggled);
  const [navColor, setNavColor] = useState('transparent');
  const [isNavbarCollapse,setIsNavbarCollapse] = useState(false)
  

  const listenScroll = () =>{
    console.log(window.scrollY);
    
    if(window.scrollY > 500){
      console.log('scroll > 700')
      setIsNavbarCollapse(true);
      setNavColor('#164B60')
    }
    else{
      console.log('scroll < 700');
      setNavColor('transparent');
      setIsNavbarCollapse(false);
    }
    // window.scrollY > 100 ? setNavColor('#164B60') : setNavColor('transparent');
    // window.scrollY > 100 ? setIsNavbarCollapse(true) : setIsNavbarCollapse(false);
 }

  useEffect(() => {
    window.addEventListener('scroll', listenScroll)
    return () => window.removeEventListener('scroll', listenScroll);
  }, [])

  useEffect(() => {
    const handleWindowResize = () => {
      console.log(window.innerWidth);
      window.innerWidth < 800
        ? setIsMobileResponsive(true)
        : setIsMobileResponsive(false);
      window.innerWidth < 800 ? setIsToggled(true) : setIsToggled(false);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  console.log(isToggled);

  return (
    <>
    <div className='logo-box'>
          <Link to="/">
            <img 
            className={`navbar-logo ${isNavbarCollapse 
            ? 'logo-collapse' : 'logo-expand'}`} 
            src="./images/logo.png" 
            alt="" />
          </Link>
      </div>
      <Box className='navbar-wrapper'
      w='100vw'
      position='fixed'>
        <nav style={{backgroundColor:`${navColor}`}} className="navbar">
          
          
          {isNavbarCollapse && 
          <>
          <Flex position='absolute' 
          left='0px'
          pl='4%'
          color='white' 
          w='70%'
          className='schoolName'
          align='center'
          justifySelf='flex-start'>
          <Text textAlign='left' as='b' fontSize='2xl'>ABC Public School</Text>
          </Flex> 
          
            </>
}
{isMobileResponsive && 
  <Box className="menu-icon"
           onClick={() => setIsToggled(!isToggled)}>
              <HamburgerIcon boxSize="2rem" zIndex='10' />
            </Box>
}

          {!isMobileResponsive && (
            <div>
              <ul className="navbar-navigation">
                <li
                  className={`nav-item ${
                    isSchoolHovered ? "schoolHovered" : ""
                  }`}
                  onMouseEnter={() => setIsSchoolHovered(true)}
                  onMouseLeave={() => setIsSchoolHovered(false)}
                >
                  <div className="nav-links School">
                    <Link to='/'>
                    <Text fontSize="lg" as="b">
                      School
                    </Text>{" "}
                    </Link>
                  </div>
                  
                </li>
                

                <li
                  className={`nav-item ${isCampusHovered ? "hovered" : ""}`}
                  onMouseEnter={() => setIsCampusHovered(true)}
                  onMouseLeave={() => setIsCampusHovered(false)}
                >
                  <div className="nav-links Campus">
                    <Link to='/principal'>
                    <Text fontSize="lg" as="b">
                      Principal's Desk
                    </Text>{" "}
                    </Link>
                  </div>
                  
                </li>

                <li>
                  <Flex className="nav-links Careers" align="center">
                    <Link to='/career'>
                    <Text fontSize="lg" as="b">
                      Careers
                    </Text>
                    </Link>
                  </Flex>
                </li>
                <li
                  className={`nav-item ${isCurriculumHovered ? "hovered" : ""}`}
                  onMouseEnter={() => setIsCurriculumHovered(true)}
                  onMouseLeave={() => setIsCurriculumHovered(false)}
                >
                  <div className="nav-links Curriculum">
                    <Link to='/admin'>
                    <Text fontSize="lg" as="b">
                      Admin
                    </Text>
                    </Link>{" "}
                  </div>
                 
                </li>
                
                
              </ul>
            </div>
          )}
          </nav>

          {isMobileResponsive && (
            <Box
            w='100%'
              className={`sidebar-wrapper ${
                isToggled ? "sidebar-toggled" : "sidebar-untoggled"
                
              }`}
            >
              <Sidebar
                className="sidebar-nav"
                ltr="false"
                backgroundColor="#A2FF86"
                collapsedWidth="0px"
                collapsed={isToggled}
                width='100vw'
              >
                
                <Menu classname=''>
                <Link to='/' label='Home' onClick={() => setIsToggled(true)}>
                <SubMenu label='Home' className="sidebarSubMenu" >
                 
                </SubMenu>
                </Link>

                <Link to='/principal' onClick={() => setIsToggled(true)}>
                <SubMenu className="sidebarSubMenu"  label="From The Principal's Desk" >
                </SubMenu>
                </Link>

               

                <Link to='/login' onClick={() => setIsToggled(true)}>
                  <SubMenu className='sidebarSubMenu' label='Login'>

                  </SubMenu>
                </Link>

                <Link to='/career' onClick={() => setIsToggled(true)}>
                  <SubMenu className='sidebarSubMenu' label='Careers'>

                  </SubMenu>
                </Link>

                </Menu>
              </Sidebar>
            </Box>
          )}
        </Box>
        </>
  );
};

export default Navbar;
