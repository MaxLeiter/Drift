import Card from "@geist-ui/core/dist/card";
import Spacer from "@geist-ui/core/dist/spacer";
import Grid from "@geist-ui/core/dist/grid";
import Divider from "@geist-ui/core/dist/divider";

import Skeleton from "react-loading-skeleton";

const ListItemSkeleton = () => (<Card>
    <Spacer height={1 / 2} />
    <Grid.Container justify={'space-between'} marginBottom={1 / 2}>
        <Grid xs={8} paddingLeft={1 / 2}><Skeleton width={150} /></Grid>
        <Grid xs={7}><Skeleton width={100} /></Grid>
        <Grid xs={4}><Skeleton width={70} /></Grid>
    </Grid.Container>

    <Divider h="1px" my={0} />

    <Card.Content >
        <Skeleton width={200} />
    </Card.Content>
</Card>)

export default ListItemSkeleton