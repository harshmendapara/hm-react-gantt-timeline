import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {CellUnits} from './index'

class HeaderView extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        schedulerData: PropTypes.object.isRequired,
        nonAgendaCellHeaderTemplateResolver : PropTypes.func,
    }

    render() {
        const {schedulerData, nonAgendaCellHeaderTemplateResolver} = this.props;
        const {headers, cellUnit, config, localeMoment} = schedulerData;
        let headerHeight = schedulerData.getTableHeaderHeight();
        let cellWidth = schedulerData.getContentCellWidth();
        let minuteStepsInHour = schedulerData.getMinuteStepsInHour();

        let headerList = [];
        let style = {};
        if(cellUnit === CellUnits.Hour){
            headers.forEach((item, index) => {
                if(index % minuteStepsInHour === 0){
                    let datetime = localeMoment(item.time);
                    const isCurrentTime = datetime.isSame(new Date(), 'hour');

                    style = !!item.nonWorkingTime ? {width: cellWidth*minuteStepsInHour, color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor} : {width: cellWidth*minuteStepsInHour};

                    if(index === headers.length - minuteStepsInHour)
                        style = !!item.nonWorkingTime ? {color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor} : {};

                    let pFormattedList = config.nonAgendaDayCellHeaderFormat.split('|').map(item => datetime.format(item));
                    let element;

                    let pFormattedListDay = config.nonAgendaOtherCellHeaderFormatDay.split('|').map(item => datetime.format(item));

                    if (typeof nonAgendaCellHeaderTemplateResolver === 'function') {
                        element = nonAgendaCellHeaderTemplateResolver(schedulerData, item, pFormattedList, pFormattedListDay, style)
                    }
                    else {
                        const pList = pFormattedList.map((item, index) => (
                            <div key={index}>{item}</div>
                        ));
                        const pListDay = pFormattedListDay.map((item, index) => (
                            <div key={index}>{item}</div>
                        ));
                       
                        element = (
                            <th key={item.time} className="header3-text" style={style}>
                                <div>
                                    {pList}
                                </div>
                                <div>
                                    {pListDay}
                                </div>
                            </th>
                        );
                    }
                    headerList.push(element);
                }
            })
        }
        else {
            headerList = headers.map((item, index) => {
                let datetime = localeMoment(item.time);

                let isCurrentDate = datetime.isSame(new Date(), 'day');

                style = !!item.nonWorkingTime ? {width: cellWidth, color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor} : {width: cellWidth};
                if (item.isFriday) {
                    style = { ...style, borderRight: '2px solid #F08421'}
                }
                if(index === headers.length - 1)
                    style = !!item.nonWorkingTime ? {color: config.nonWorkingTimeHeadColor, backgroundColor: config.nonWorkingTimeHeadBgColor} : {};

                if (isCurrentDate)
                    style = { ...style, backgroundColor: config.currentDayBgColor}

                let pFormattedList = config.nonAgendaOtherCellHeaderFormat.split('|').map(item => datetime.format(item));
                let pFormattedListDay = config.nonAgendaOtherCellHeaderFormatDay.split('|').map(item => datetime.format(item));
                

                if (typeof nonAgendaCellHeaderTemplateResolver === 'function') {
                    return nonAgendaCellHeaderTemplateResolver(schedulerData, item, pFormattedList, pFormattedListDay, style)
                }

                const pList = pFormattedList.map((item, index) => (
                    <div key={index}>{item}</div>
                ));

                const pListDay = pFormattedListDay.map((item, index) => (
                    <div key={index}>{item}</div>
                ));

                return (
                    <th key={item.time} className="header3-text" style={style}>
                         <div>
                           {pListDay}
                        </div>
                        <div className="headerDate-text">
                            {pList}
                        </div>
                    </th>
                );
            });
        }

        return (
            <thead>
                <tr style={{height: headerHeight}}>
                    {headerList}
                </tr>
            </thead>
        );
    }
}

export default HeaderView
