# devbox

How this was made:

```
npm init
npm install typescript --save-dev
tsc --init
# edit ^
npm install cdk --save-dev
```

code:

```
import {StandardDevBox} from 'cdk-lib-ec2'

const box = new StandardDevBox();
```