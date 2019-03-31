import React, { Component } from 'react';
import axios from 'axios';
import {Button,Grid} from '@material-ui/core'
import Nothing from './nothing.png'
import Processing from './processing.png'
import Submitterr from './submitter.png'
import './index.css'
import {Table,TableBody,TableCell,TableHead,TableRow,Paper} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const BASE_URL = 'http://localhost:4000/';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
  });



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            imageUrls: [],
            message: '',
            loading:false,
            uploaded:false,
            array:null,
            rows:[],
            recipe:null,
            food:null
        }
    }
    selectImages = (event) => {
        this.setState({
            uploaded:true
        })
    let images = []
    let image=[]
    for (var i = 0; i < event.target.files.length; i++) {
        images[i] = event.target.files.item(i);
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    let message = `${images.length} valid image(s) selected`
    image=images[images]
    this.setState({ images, message })
        console.log(images.length)
        images=[]
    }
    uploadImages = () => {
        this.setState({
            uploaded:false,
            loading:true
        })
    const uploaders = this.state.images.map(image => {
    const data = new FormData();
    data.append("image", image, image.name);
    // Make an AJAX upload request using Axios
    return axios.post(BASE_URL + 'upload', data)
    .then(response => {
        this.setState({loading:false})
        console.log(response.data)
        console.log(response.data.concepts[1].name)
    this.setState({
    imageUrls: [ response.data.imageUrl, ...this.state.imageUrls ],
    response:response.data,
    food:response.data.answer!==undefined
    });

    axios.get('https://api.edamam.com/search?q='+response.data.concepts[1].name+'&app_id=8a705fc2&app_key=9a27deb00bda833b260d5fbde99a527f')
            .then(res=>{
            console.log(res);
            this.setState({
                recipe:res.data.hits[0].recipe,
                array:res.data.hits[0].recipe.totalNutrients
            })
            const x=res.data.hits[0].recipe.totalNutrients
            console.log(x)
            Object.entries(x).map(obj => {
                console.log(obj)
                const label   = obj[1].label;
                const quantity = obj[1].quantity;
                const unit = obj[1].unit;
                var arr=[...this.state.rows,{label:label,quantity:quantity,unit:unit}]
                this.setState({
                    rows:arr
                })
                // do whatever you want with those values.
             });
             console.log(this.state.rows)
        })
        .catch(err=>{
            console.log(err)
        })
    console.log(response.data.answer)
    })
    });
    // Once all the files are uploaded 
    axios.all(uploaders).then(() => {
    console.log('done');
    }).catch(err => alert(err.message));

    console.log(this.state)

    }
    render() {

        const { classes } = this.props;

    return (
        <React.Fragment>
            <div style={{padding:50,width:"100%",textAlign:"center"}}>
                <br/>
                <div style={{overflow:"hidden",margin:"auto"}} >
                
                <h1>Image Uploader</h1><hr/>
                    <div className='inputter' style={{float:"left",marginLeft:"15%",marginRight:"5%",paddingRight:"5%",borderRight:"1px solid rgba(0,0,0,0.5)",marginTop:5}} >
                    <div style={{paddingTop:40}}>
                        <div >
                            <input className="form-control " type="file" 
                            onChange={this.selectImages} multiple style={{marginBottom:"10px",height:"100%"}}/>
                        </div>
                        <p className="text-info">{this.state.message}</p>
                        <br/><br/>
                        <div >
                            <Button style={{background:'#3f51b4',color:"#eee"}} value="Submit" 
                            onClick={this.uploadImages}>Submit</Button>
                            <Button style={{background:'#3f51b4',color:"#eee",marginLeft:5}} value="Submit" 
                            onClick={()=>{window.location.reload()}}>Reset</Button>
                            <br/><br/><br/>
                        </div>
                    </div>
                        
                    </div>
                    <div >
                    {console.log(this.state.images.length)}
                    { 
                    this.state.uploaded==true?(
                        <div>
                        <br/>
                            <img width="300" height="230" src={Submitterr} className="img-rounded img-responsive"
                            alt="not available" style={{border:"1px solid BLACK"}}/><br/>
                        </div>
                    ):(
                        this.state.loading==true?(
                            <div>
                            <br/>
                                <img width="300" height="230" src={Processing} className="img-rounded img-responsive"
                                alt="not available" style={{border:"1px solid BLACK"}}/><br/>
                            </div>
                        )
                        :(
                        this.state.images.length!=0?(
                                this.state.imageUrls.map((url, i) => (
                                    <div  key={i}>
                                    <br/>
                                        <img width="300" height="230" src={BASE_URL + url} className="img-rounded img-responsive"
                                        alt="not available"/><br/>
                                    </div>
                                ))
                                ):(
                                <div>
                                    <img width="300" height="230" src={Nothing} className="img-rounded img-responsive"
                                    alt="not available" style={{border:"1px solid BLACK"}}/><br/>
                                </div>
                            )
                        )
                    )
                        }
                    </div>
                </div>
                <hr/><br/>
                
                <div>
                        {console.log(this.state.array)}
                        {
                            (this.state.food==false)?
                            (
                                
                                <h3>Sorry, We weren't able to detect any food in the image</h3>
                            ):(
                                this.state.rows.length!=0?(
                                    <div style={{textAlign:"center"}}>
                                    <h1 style={{textTransform:"capitalize"}}>{this.state.response.concepts[1].name}</h1>
                                    <h4>Calories : {this.state.recipe.calories} kcal per {this.state.recipe.totalWeight} g of the substance </h4>
                                        <Paper className={classes.root}>
                                            <Table className={classes.table}>
                                                <TableHead>
                                                <TableRow>
                                                    <TableCell>Nutrients</TableCell>
                                                    <TableCell align="right">Value</TableCell>
                                                    <TableCell align="right">Units</TableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {this.state.rows.map(row => (
                                                    <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell align="right">{row.quantity}</TableCell>
                                                    <TableCell align="right">{row.unit}</TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </div>
                                ):(
                                    null
                                )
                            )
                        }
                </div>

            </div>
            
        </React.Fragment>
    );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(App);