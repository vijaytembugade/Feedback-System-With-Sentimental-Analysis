import React from 'react';
import axios from 'axios';
import Table from '../../Table';
import { Grid } from '@material-ui/core';

const Report = (props) => {
	const [loading, setLoading] = React.useState(false);
	const [data, setData] = React.useState([]);

	React.useEffect(() => {
		setLoading(true);
		console.log('form_id', props.match.params.form_id);
		// setData({
		// 	analysis: {
		// 		log_result: [
		// 			{
		// 				best: 'Subject Depth',
		// 				section_name: 'subject_command',
		// 				worst: 'Interest Stimulation in Students',
		// 			},
		// 			{
		// 				best: 'Syllabus Completed %',
		// 				section_name: 'punctuality',
		// 				worst: 'Time Utiliszation',
		// 			},
		// 			{
		// 				best: 'Teaching Methodology Used',
		// 				section_name: 'teaching_methodology',
		// 				worst: 'Teaching Methodology Used',
		// 			},
		// 			{
		// 				best: 'Communication Gap',
		// 				section_name: 'doubt_solving',
		// 				worst: 'doubt_solving_comment',
		// 			},
		// 			{
		// 				best: 'Helpful and Motivates Student',
		// 				section_name: 'behavior_and_discipline',
		// 				worst: 'Prevents Cheating in Class',
		// 			},
		// 		],
		// 		summary: { summary: '' },
		// 		suggestion: {
		// 			0: 'Teachers should give references to other books also',
		// 		},
		// 	},
		// });
		// setLoading(false);
		axios
			.post('/api/reports/generate', {
				formId: props.match.params.form_id,
			})
			.then((res) => {
				setData(res.data);
				setLoading(false);
			})
			.catch((err) => console.log(err.response.data));
	}, []);

	return (
		<div>
			{loading ? (
				'loading'
			) : (
				<Grid container spacing={3} direction="column">
					<Grid item>
						<h1>Report</h1>
					</Grid>
					<Grid item style={{ alignSelf: 'center' }}>
						<Table
							columns={[
								{
									Header: 'Subject',
									accessor: 'section_name',
									Cell: ({ row }) => {
										return row.original.section_name.replace('_', ' ');
									},
								},
								{
									Header: 'Best',
									accessor: 'best',
								},
								{
									Header: 'Worst',
									accessor: 'worst',
								},
							]}
							data={
								data.analysis !== undefined &&
								data.analysis.log_result.length > 0
									? data.analysis.log_result
									: []
							}
						/>
					</Grid>
					<Grid item>
						{data && data.analysis && data.analysis.suggestions && (
							<>
								<h1>Suggestions</h1>
								<ol>
								{Object.values(data.analysis.suggestions).map((suggestion) => {
									return <li>{suggestion}</li>
								})}
								</ol>
							</>
						)}
					</Grid>
					<Grid item>
						{data && data.analysis && data.analysis.summary && (
							<>
								<h1>Summary</h1>
								<p>{data.analysis.summary ? data.analysis.summary.summary.split('↵').map(sentence => {
									return sentence + '\n'
								}) : 'No Summary'}</p>
							</>
						)}
					</Grid>
					<Grid item>
						<h1>Graphs</h1>
						{data && data.analysis && data.analysis.section1_img && (
							<>
								<img alt="section1_img" title="section1_img" src={data.analysis.section1_img} style={{maxWidth: '800px', margin: '5px' }} />
							</>
						)}
						{data && data.analysis && data.analysis.section4_img && (
							<>
								<img alt="section4_img" title="section4_img" src={data.analysis.section4_img} style={{maxWidth: '800px', margin: '5px' }} />
							</>
						)}
						{data && data.analysis && data.analysis.section5_img && (
							<>
								<img alt="section5_img" title="section5_img" src={data.analysis.section5_img} style={{maxWidth: '800px', margin: '5px' }} />
							</>
						)}
						<br></br>
						{data && data.analysis && data.analysis.syllabus_completed && (
							<>
								<img alt="syllabus_completed" title="syllabus_completed" src={data.analysis.syllabus_completed} style={{maxWidth: '800px', margin: '5px' }} />
							</>
						)}
						{data && data.analysis && data.analysis.subject_understanding && (
							<>
								<img alt="subject_understanding" title="subject_understanding" src={data.analysis.subject_understanding} style={{maxWidth: '800px', margin: '5px'  }} />
							</>
						)}

					</Grid>
				</Grid>
			)}
		</div>
	);
};

export default Report;
