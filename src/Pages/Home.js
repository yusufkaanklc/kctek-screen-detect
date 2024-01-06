import React from "react";
import { Link } from "react-router-dom"; // İçe aktarma değişikliğine dikkat edin
import { Button, Flex } from "@chakra-ui/react";
function Home() {
  return (
    <Flex h={"100vh"} align={"center"} justify={"center"}>
      <Button>
        <Link to="/questPage">Sınava git</Link>
      </Button>
    </Flex>
  );
}

export default Home;
