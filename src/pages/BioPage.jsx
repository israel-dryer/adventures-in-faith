import React from 'react';
import {Box, Heading, Image, Text, VStack} from "@chakra-ui/react";

const BioPage = () => {
    return (
        <VStack gap={8} paddingY={8}>
            <Heading className='heading-1' paddingY={4}>Biography</Heading>
            <VStack>
                <Image src="bio/duane-profile-5-4.png" maxWidth={250} borderRadius={8} filter='grayscale(100%)'></Image>
                <Text size={20} fontWeight='medium'>Mar 2, 1937 - Oct 28, 2024</Text>

            </VStack>
            <VStack gap={4} maxWidth={750}>
                <Box>
                    Duane Harvey Klepel was born in Odessa, Minnesota on March 2, 1937. He grew up in St. Paul,
                    Minnesota and graduated from Concordia Lutheran College in Seward, Nebraska where he met Joyce
                    (Rahmeier) whom he married on December 26, 1959.
                </Box>
                <Box>
                    Duane and Joyce moved to New York City where he took his first teaching position at Saint John's
                    Lutheran school in Queensborough, New York City. During those 2 years daughters Mary (Brown) and
                    Dawn (Lsuwaratana) were born.
                </Box>
                <Box>
                    Duane and his small family returned to Minnesota where he worked for Honeywell for 6 years and then
                    taught high school science in Lynd, Minnesota for 4 years. Two sons, Daniel and Robert Klepel, were
                    added to the family during this time.
                </Box>
                <Box>
                    In 1972, Duane felt a prompting from God to sell all his possessions and home and go to Israel to
                    help seeking people find Jesus. The family enjoyed 2 successful years in Israel. Duane helped
                    hundreds of young travelers (hippies) find a personal relationship with Jesus during this time.
                </Box>
                <Box>
                    In 1974, Duane brought his family back to the United States and bought a house in Rich Hill,
                    Missouri. After living in Rich Hill for 2 years, he again felt the prompting of the Lord to serve
                    God overseas. In 1976, Duane sold the house in Rich Hill and the family moved to Thailand where he
                    served the Lord for 22 years. One more daughter, Judy (Dryer) was added to the family in Thailand.
                </Box>
                <Box>
                    In 1998, Duane and Joyce and their daughter, Judy, returned to the United States to care for their
                    aging parents. After they returned yet another son was added to the family. Rosen joined the Klepel
                    family on March 2, 1998.
                </Box>
                <Box>
                    After their parents had passed, Duane once again felt the nudging of the Lord to go overseas in
                    service to Jesus. In 2013 they traveled to Griffith, Australia, where they lived for 5 years,
                    teaching religious studies in the public schools and helping with elderly ministry.
                </Box>
                <Box>
                    Duane and Joyce returned to their Rich Hill home in 2018 where they continued to shine the light of
                    Jesus to their church friends, neighbors and community.
                </Box>
                <Box>
                    Duane was a very creative person. He built 4 houses, building the last house when he was in his
                    70's. He also started building a few airplanes, but sold them before they were completed. While
                    living in Thailand, Duane built a 50 foot catamaran boat where he lived with his family for many
                    years.
                </Box>
                <Box>
                    Duane is remembered by all as a humble servant of God who loved to tell everyone about salvation
                    from sin that is available only through Jesus Christ.
                </Box>
            </VStack>
        </VStack>
    );
};

export default BioPage;