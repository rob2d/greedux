import { teal, lightGreen } from 'material-ui/styles/colors'

export default
{
    fontFamily: 'roboto_light',
    palette:
    {
        text :
        {
            primary      : teal['A500'],
            secondary    : lightGreen['A300'],
            disabled     : '#DDBBBB',
            divider      : '#BDBDBD',
            lightDivider : '#DFDFDF'
        },
        action:
        {
            active   : 'rgba(255, 255, 255, 1)',
            disabled : 'rgba(255, 255, 255, 0.3)'
        },
        background:
        {
            default      : '#303030',
            table        : '#CCCCCC',
            appBar       : '#EEEEEE',
            contentFrame : '#EEEEEE',
            status       : '#000000'
        }
    }
};